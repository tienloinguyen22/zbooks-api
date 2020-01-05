/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { bootstrapModules, convertQueryHandlerToResolver, convertCommandHandlerToResolver } from '@app/modules';
import graphqlFields from 'graphql-fields';

jest.mock('graphql-fields', () => jest.fn());

describe('server.modules', () => {
  it('runs successfully', async () => {
    const { resolvers } = await bootstrapModules();

    expect(resolvers.Query.users).toBeDefined();
    expect(resolvers.Mutation.users()).toBeDefined();
  });

  describe('convertQueryHandlerToResolver', () => {
    it('runs successfully', async () => {
      (graphqlFields as jest.Mock).mockReturnValue({
        field: 'field',
      });
      const args = {
        id: '1',
      };
      const sampleContext = {};
      const info = {};
      let handlerQuery;
      let handlerContext: any;
      const handler: (query: any, context: any) => Promise<any> = async (query, context) => {
        handlerQuery = query;
        handlerContext = context;
        return {};
      };

      const resolver = convertQueryHandlerToResolver(handler);

      await resolver(undefined, args, sampleContext, info);

      expect(handlerQuery).toEqual(args);
      expect(handlerContext.fields).toBeDefined();
    });
  });

  describe('convertCommandHandlerToResolver', () => {
    it('runs successfully', async () => {
      (graphqlFields as jest.Mock).mockReturnValue({
        field: 'field',
      });
      const args = {
        payload: {
          id: '1',
        },
      };
      const sampleContext = {};
      const info = {};
      let handlerCommand;
      let handlerContext: any;
      const handler: (command: any, context: any) => Promise<any> = async (command, context) => {
        handlerCommand = command;
        handlerContext = context;
        return {};
      };

      const resolver = convertCommandHandlerToResolver(handler);

      await resolver(args, sampleContext, info);

      expect(handlerCommand).toEqual({
        ...args.payload,
        commandId: 'guid',
      });
      expect(handlerContext.fields).toBeDefined();
    });
  });
});

export {};
