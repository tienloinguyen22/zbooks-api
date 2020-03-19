import { Context, QueryResult, PaginationTypes, buildConditions, QueryOperators } from '@app/core';
import { categoriesRepository } from '../repository';
import { Category, CategoryQuery } from '../interfaces';
import { postsRepository } from '../../posts/repository';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countPostsPromises: any[] = [];
  result.data.forEach((item) => {
    countPostsPromises.push(
      postsRepository.countPosts([
        {
          field: 'categoryId',
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
