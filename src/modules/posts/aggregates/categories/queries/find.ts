import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { categoriesRepository } from '../repository';
import { Category, CategoryQuery } from '../interfaces';

export const handler = async (query: CategoryQuery, context: Context): Promise<QueryResult<Category>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await categoriesRepository.findWithOffsetPagination!(
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
