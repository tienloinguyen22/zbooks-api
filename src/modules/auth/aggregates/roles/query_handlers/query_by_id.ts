import { QueryById, Context, findById } from '@app/core';
import { Role } from '../interfaces';

export const handler = async (query: QueryById, context: Context): Promise<Role | undefined> =>
  findById(query, context, 'roles');
