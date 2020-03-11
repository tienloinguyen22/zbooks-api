import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { shopsRepository } from '../repository';
import { Shop, ShopQuery } from '../interfaces';

export const handler = async (query: ShopQuery, context: Context): Promise<QueryResult<Shop>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await shopsRepository.findWithOffsetPagination!(
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
