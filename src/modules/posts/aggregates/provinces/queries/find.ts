import { Context, QueryResult, PaginationTypes, buildConditions, QueryOperators } from '@app/core';
import { provincesRepository } from '../repository';
import { Province, ProvinceQuery } from '../interfaces';
import { postsRepository } from '../../posts/repository';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countPostsPromises: any[] = [];
  result.data.forEach((item) => {
    countPostsPromises.push(
      postsRepository.countPosts([
        {
          field: 'provinceId',
          operator: QueryOperators.equals,
          value: item.id,
        },
      ]),
    );
  });
  const countPosts = await Promise.all(countPostsPromises);

  return {
    ...result,
    data: result.data.map((item, index) => ({
      ...item,
      totalPosts: countPosts[index],
    })),
  };
};
