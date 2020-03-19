import { Context, QueryResult, PaginationTypes, buildConditions, QueryOperators } from '@app/core';
import { brandsRepository } from '../repository';
import { Brand, BrandQuery } from '../interfaces';
import { postsRepository } from '../../posts/repository';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countPostsPromises: any[] = [];
  result.data.forEach((item) => {
    countPostsPromises.push(
      postsRepository.countPosts([
        {
          field: 'brandId',
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
