import { DocumentNode } from 'graphql';
import { UsersRepository } from '@app/modules/auth/aggregates/users/repository';
import { validateToken } from '@app/core';
import { Config } from 'apollo-server-express';
import { BooksRepository } from '@app/modules/books/aggregates/books/repository';
import { FavoriteBooksRepository } from '@app/modules/books/aggregates/favorite_books/repository';

interface ApolloParams {
  typeDefs: DocumentNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: any;
}

export const getApolloConfig = ({ typeDefs, resolvers }: ApolloParams): Config => ({
  typeDefs,
  resolvers,
  dataSources: () => ({
    users: new UsersRepository(),
    books: new BooksRepository(),
    favoriteBooks: new FavoriteBooksRepository(),
  }),
  playground: true,
  introspection: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: async ({ req, event }: { req: any; event: any }) => {
    return {
      user: await validateToken(req ? req.headers.token : event.headers.token, new UsersRepository()),
    };
  },
});
