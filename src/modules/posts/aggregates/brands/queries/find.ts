import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { brandsRepository } from '../repository';
import { Brand, BrandQuery } from '../interfaces';

export const handler = async (query: BrandQuery, context: Context): Promise<QueryResult<Brand>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await brandsRepository.findWithOffsetPagination!(
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
