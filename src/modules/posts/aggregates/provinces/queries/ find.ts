import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { provincesRepository } from '../repository';
import { Province, ProvinceQuery } from '../interfaces';

export const handler = async (query: ProvinceQuery, context: Context): Promise<QueryResult<Province>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await provincesRepository.findWithOffsetPagination!(
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
