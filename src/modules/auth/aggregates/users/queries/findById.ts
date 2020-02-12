import { QueryById, Context, findById } from '@app/core';
import { User } from '../interfaces';

export const handler = async (query: QueryById, context: Context): Promise<User | undefined> =>
  findById(query, context, 'users');
