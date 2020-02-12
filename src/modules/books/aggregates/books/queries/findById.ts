import { QueryById, Context, findById } from '@app/core';
import { Book } from '../interfaces';

export const handler = async (query: QueryById, context: Context): Promise<Book | undefined> =>
  findById(query, context, 'books');
