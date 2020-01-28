import { Context, validateAuthenticate, validateSchema, MongoQueryOperators } from '@app/core';
import * as yup from 'yup';
import _ from 'lodash';
import { FindByBookQuery, FavoriteBook, FavoriteBookRepository } from '../interfaces';

export const handler = async (query: FindByBookQuery, context: Context): Promise<FavoriteBook | undefined> => {
  const repository: FavoriteBookRepository = context.dataSources.favoriteBooks;

  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  await validateSchema(
    yup.object().shape<FindByBookQuery>({
      book: yup.string().required('books/missing-book-id'),
    }),
    query,
  );

  // 3. Query database
  const conditions = [
    {
      field: 'book',
      operator: MongoQueryOperators.equals,
      value: query.book,
    },
    {
      field: 'user',
      operator: MongoQueryOperators.equals,
      value: _.get(context, 'user.id', ''),
    },
  ];
  const favoriteBook = await repository.findOne(conditions);
  return favoriteBook;
};
