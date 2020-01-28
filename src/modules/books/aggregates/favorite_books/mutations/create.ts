import { Context, validateAuthenticate, validateSchema, MongoQueryOperators, AppError } from '@app/core';
import * as yup from 'yup';
import _ from 'lodash';
import { FindByBookQuery, FavoriteBook, FavoriteBookRepository } from '../interfaces';

export const handler = async (query: FindByBookQuery, context: Context): Promise<FavoriteBook> => {
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

  // 3. Check exist
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
  const existedFavoriteBook = await repository.findOne(conditions);
  if (existedFavoriteBook) {
    throw new AppError('Favorite book already exist', 'books/favorite-book-already-exist');
  }

  // 4. Create new record
  const favoriteBook = await repository.create({
    book: query.book,
    user: _.get(context, 'user.id'),
  });
  return favoriteBook;
};
