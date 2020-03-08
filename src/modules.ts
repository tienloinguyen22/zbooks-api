/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { DocumentNode } from 'graphql';
import { readdirSync, existsSync } from 'fs';
import { baseTypeDefs, baseResolvers, sanitizePayload, withErrorHandler, requireModule } from '@app/core';
import merge from 'lodash/fp/merge';
import graphqlFields from 'graphql-fields';

interface AggregateConfiguration {
  typeDefs: DocumentNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: Record<string, any>;
}

interface ModuleConfiguration {
  aggregates: AggregateConfiguration[];
}

interface BootstrapModulesConfiguration {
  typeDefs: DocumentNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: any;
}

const modulesDir = `${__dirname}/modules`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertQueryHandlerToResolver = (handler: (query: any, context: any) => Promise<any>): any => {
  return async (args: any, context: any, info: any) => {
    const fields = graphqlFields(
      info,
      {},
      {
        excludedFields: ['__typename'],
      },
    );
    context.fields = {};
    Object.keys(fields.data || fields).forEach((key) => {
      context.fields[key] = 1;
    });

    let query: Record<string, any> = {};
    if (args.payload) {
      query = {
        ...args.payload,
      };
    }
    if (args.id) {
      query = {
        ...query,
        id: args.id,
      };
    }

    return withErrorHandler(handler)(sanitizePayload(query), context);
  };
};

export const convertMutationHandlerToResolver = (handler: (payload: any, context: any) => Promise<any>): any => {
  return async (args: any, context: any, info: any) => {
    const fields = graphqlFields(
      info,
      {},
      {
        excludedFields: ['__typename'],
      },
    );
    context.fields = fields;

    const isUpload = !!args.file;
    return withErrorHandler(handler)(isUpload ? args.file : sanitizePayload(args.payload), context);
  };
};

const bootstrapAggregate = async (aggregateName: string, moduleName: string): Promise<AggregateConfiguration> => {
  const aggregateDir = `${modulesDir}/${moduleName}/aggregates/${aggregateName}`;
  const typeDefsModule = requireModule(`${aggregateDir}/graphql/type_defs`);
  const resolversModule = requireModule(`${aggregateDir}/graphql/resolvers`);
  let { resolvers } = resolversModule || {
    resolvers: {},
  };

  // Create aggregate tables if not exists
  const repositoryPath = `${aggregateDir}/repository`;
  const repository = requireModule(repositoryPath);
  const repositoryName = `${aggregateName}Repository`;
  if (repository && repository[repositoryName] && repository[repositoryName].createTable) {
    await repository[repositoryName].createTable();
  }

  // Register queries resolvers
  const queriesPath = `${aggregateDir}/queries`;

  if (existsSync(queriesPath)) {
    const queries = readdirSync(queriesPath);
    const queryResolvers: { [query: string]: any } = {};

    if (queries && queries.length > 0) {
      queries
        .map((name) => name.replace('.js', ''))
        .map((name) => name.replace('.ts', ''))
        .forEach((queryName) => {
          const queryFile = requireModule(`${aggregateDir}/queries/${queryName}`);
          if (queryFile) {
            (() => {
              queryResolvers[queryName] = convertQueryHandlerToResolver(queryFile.handler);
            })();
          }
        });
    }

    resolvers = merge(resolvers, {
      Query: {
        [aggregateName]: () => queryResolvers,
      },
    });
  }

  // Register mutations resolvers
  const mutationsPath = `${aggregateDir}/mutations`;

  if (existsSync(mutationsPath)) {
    const mutations = readdirSync(mutationsPath);
    const mutationResolvers: { [mutation: string]: any } = {};

    if (mutations && mutations.length > 0) {
      mutations
        .map((name) => name.replace('.js', ''))
        .map((name) => name.replace('.ts', ''))
        .forEach((mutationName) => {
          /* eslint-disable-next-line max-len */
          const mutationFile = requireModule(`${aggregateDir}/mutations/${mutationName}`);
          if (mutationFile) {
            (() => {
              mutationResolvers[mutationName] = convertMutationHandlerToResolver(mutationFile.handler);
            })();
          }
        });
    }

    resolvers = merge(resolvers, {
      Mutation: {
        [aggregateName]: () => mutationResolvers,
      },
    });
  }

  return {
    typeDefs: typeDefsModule.typeDefs,
    resolvers,
  };
};

const bootstrapModule = async (moduleName: string): Promise<ModuleConfiguration> => {
  const moduleDir = `${modulesDir}/${moduleName}`;
  const aggregateNames = readdirSync(`${moduleDir}/aggregates`);
  const configurations: AggregateConfiguration[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const aggregateName of aggregateNames) {
    // eslint-disable-next-line no-await-in-loop
    const aggregateConfigs = await bootstrapAggregate(aggregateName, moduleName);
    configurations.push(aggregateConfigs);
  }

  return {
    aggregates: configurations,
  };
};

export const bootstrapModules = async (): Promise<BootstrapModulesConfiguration> => {
  const moduleNames = readdirSync(modulesDir);

  const configurations: ModuleConfiguration[] = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleName of moduleNames) {
    // eslint-disable-next-line no-await-in-loop
    const aggregateConfigs = await bootstrapModule(moduleName);
    configurations.push(aggregateConfigs);
  }

  const typeDefs = [baseTypeDefs];
  configurations.forEach((config) => config.aggregates.forEach((agg) => typeDefs.push(agg.typeDefs)));

  let resolvers = {
    ...baseResolvers,
    Query: {},
    Mutation: {},
  };
  configurations.forEach((config) =>
    config.aggregates.forEach((agg) => {
      resolvers = merge(resolvers, agg.resolvers);
    }),
  );

  return {
    typeDefs,
    resolvers,
  };
};
