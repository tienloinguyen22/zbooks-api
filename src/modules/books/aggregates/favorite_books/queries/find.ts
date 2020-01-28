import { Context, QueryResult } from '@app/core';
import { findWithOffsetPagination } from '@app/core/helpers/find_with_offset_pagination';
import { FavoriteBookQuery, FavoriteBook } from '../interfaces';

export const handler = async (query: FavoriteBookQuery, context: Context): Promise<QueryResult<FavoriteBook>> =>
  findWithOffsetPagination(query, context, 'favoriteBooks');
