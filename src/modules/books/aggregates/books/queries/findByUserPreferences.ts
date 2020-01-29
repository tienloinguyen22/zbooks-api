import { Context, QueryResult, validateAuthenticate, findWithOffsetPagination } from '@app/core';
import _ from 'lodash';
import { BookQuery, Book } from '../interfaces';

export const handler = async (query: BookQuery, context: Context): Promise<QueryResult<Book>> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Query database
  return findWithOffsetPagination(
    {
      ...query,
      category_in: _.get(context, 'user.preferenceCategories', []),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    context,
    'books',
  );
};
