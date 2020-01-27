import { Context, QueryResult } from '@app/core';
import { findWithOffsetPagination } from '@app/core/helpers/find_with_offset_pagination';
import { BookQuery, Book } from '../interfaces';

export const handler = async (query: BookQuery, context: Context): Promise<QueryResult<Book>> =>
  findWithOffsetPagination(query, context, 'books');
