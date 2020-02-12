import { Context } from '@app/core';
import { FavoriteBook } from '../interfaces';
import { User } from '../../../../auth/aggregates/users/interfaces';
import { Book } from '../../books/interfaces';

export const resolvers = {
  FavoriteBook: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: async (parent: FavoriteBook, _args: any, context: Context): Promise<User | undefined> => {
      if (parent.user) {
        const user = await context.dataSources.users.findById(parent.user);
        return user;
      }
      return undefined;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    book: async (parent: FavoriteBook, _args: any, context: Context): Promise<Book | undefined> => {
      if (parent.book) {
        const book = await context.dataSources.books.findById(parent.book);
        return book;
      }
      return undefined;
    },
  },
};
