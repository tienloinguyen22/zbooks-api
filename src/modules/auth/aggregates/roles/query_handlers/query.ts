import { Context, QueryResult, findWithOffsetPagination } from '@app/core';
import { Role, RoleQuery } from '../interfaces';

export const handler = async (query: RoleQuery, context: Context): Promise<QueryResult<Role>> =>
  findWithOffsetPagination(query, context, 'roles');
