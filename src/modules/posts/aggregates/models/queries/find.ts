import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { modelsRepository } from '../repository';
import { ModelQuery, Model } from '../interfaces';

export const handler = async (query: ModelQuery, context: Context): Promise<QueryResult<Model>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await modelsRepository.findWithOffsetPagination!(
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
