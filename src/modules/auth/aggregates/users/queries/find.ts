import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { User, UserQuery } from '../interfaces';
import { usersRepository } from '../repository';

export const handler = async (query: UserQuery, context: Context): Promise<QueryResult<User>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  const result = await usersRepository.findWithOffsetPagination(
    {
      type: PaginationTypes.OFFSET,
      pageIndex,
      itemsPerPage,
    },
    buildConditions(conditionFields),
    orderBy,
    context.fields,
  );
  return result;
};
