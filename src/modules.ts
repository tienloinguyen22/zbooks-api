/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { DocumentNode } from 'graphql';
import { readdirSync, existsSync } from 'fs';
import { baseTypeDefs, baseResolvers, sanitizePayload, withErrorHandler, requireModule } from '@app/core';
import merge from 'lodash/fp/merge';
import graphqlFields from 'graphql-fields';
import uuid from 'uuid/v4';

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
  return async (_parent: any, args: any, context: any, info: any) => {
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

export const convertCommandHandlerToResolver = (handler: (command: any, context: any) => Promise<any>): any => {
  return async (args: any, context: any, info: any) => {
    const fields = graphqlFields(
      info,
      {},
      {
        excludedFields: ['__typename'],
      },
    );
    context.fields = fields;
    return withErrorHandler(handler)(
      sanitizePayload({
        commandId: uuid(),
        ...args.payload,
      }),
      context,
    );
  };
};

const bootstrapAggregate = (aggregateName: string, moduleName: string): AggregateConfiguration => {
  const aggregateDir = `${modulesDir}/${moduleName}/aggregates/${aggregateName}`;
  const typeDefsModule = requireModule(`${aggregateDir}/graphql/type_defs`);
  const resolversModule = requireModule(`${aggregateDir}/graphql/resolvers`);
  let { resolvers } = resolversModule || {
    resolvers: {},
  };

  const queryHandlerModule = requireModule(`${aggregateDir}/query_handlers/query`);
  /* eslint-disable-next-line max-len */
  const queryByIdHandlerModule = requireModule(`${aggregateDir}/query_handlers/query_by_id`);
  if (queryHandlerModule) {
    (() => {
      resolvers = merge(resolvers, {
        Query: {
          [aggregateName]: convertQueryHandlerToResolver(queryHandlerModule.handler),
        },
      });
    })();
  }

  if (queryByIdHandlerModule) {
    (() => {
      const name = queryByIdHandlerModule.singularName || aggregateName.substring(0, aggregateName.length - 1);
      resolvers = merge(resolvers, {
        Query: {
          [name]: convertQueryHandlerToResolver(queryByIdHandlerModule.handler),
        },
      });
    })();
  }

  const commandHandlersPath = `${aggregateDir}/command_handlers`;
  if (existsSync(commandHandlersPath)) {
    const commandHandlerNames = readdirSync(commandHandlersPath);
    const commandResolvers: { [command: string]: any } = {};

    if (commandHandlerNames) {
      commandHandlerNames
        .map((name) => name.replace('.js', ''))
        .map((name) => name.replace('.ts', ''))
        .forEach((commandHandlerName) => {
          /* eslint-disable-next-line max-len */
          const commandHandlerModule = requireModule(`${aggregateDir}/command_handlers/${commandHandlerName}`);
          if (commandHandlerModule) {
            (() => {
              commandResolvers[commandHandlerName] = convertCommandHandlerToResolver(commandHandlerModule.handler);
            })();
          }
        });
    }

    resolvers = merge(resolvers, {
      Mutation: {
        [aggregateName]: () => commandResolvers,
      },
    });
  }

  return {
    typeDefs: typeDefsModule.typeDefs,
    resolvers,
  };
};

const bootstrapModule = (moduleName: string): ModuleConfiguration => {
  const moduleDir = `${modulesDir}/${moduleName}`;
  const aggregateNames = readdirSync(`${moduleDir}/aggregates`);
  const configurations: AggregateConfiguration[] = [];
  aggregateNames.forEach((aggregateName) => configurations.push(bootstrapAggregate(aggregateName, moduleName)));
  return {
    aggregates: configurations,
  };
};

export const bootstrapModules = (): BootstrapModulesConfiguration => {
  const moduleNames = readdirSync(modulesDir);

  const configurations: ModuleConfiguration[] = [];
  moduleNames.forEach((moduleName) => configurations.push(bootstrapModule(moduleName)));

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
