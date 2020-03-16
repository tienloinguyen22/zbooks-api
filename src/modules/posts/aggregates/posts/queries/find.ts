import { Context, QueryResult, PaginationTypes, buildConditions } from '@app/core';
import { postsRepository } from '../repository';
import { Post, PostQuery } from '../interfaces';

export const handler = async (query: PostQuery, context: Context): Promise<QueryResult<Post>> => {
  const { pageIndex, itemsPerPage, orderBy, ...conditionFields } = query;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await postsRepository.findWithOffsetPagination!(
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
