import { Context, QueryResult } from '@app/core';
import { findWithOffsetPagination } from '@app/core/helpers/find_with_offset_pagination';
import { User, UserQuery } from '../interfaces';

export const handler = async (query: UserQuery, context: Context): Promise<QueryResult<User>> =>
  findWithOffsetPagination(query, context, 'users');
