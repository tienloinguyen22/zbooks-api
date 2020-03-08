import { DocumentNode } from 'graphql';
import { validateToken } from '@app/core';
import { Config } from 'apollo-server-express';

interface ApolloParams {
  typeDefs: DocumentNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: any;
}

export const getApolloConfig = ({ typeDefs, resolvers }: ApolloParams): Config => ({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: async ({ req, event }: { req: any; event: any }) => {
    return {
      user: await validateToken(req ? req.headers.token : event.headers.token),
    };
  },
});
