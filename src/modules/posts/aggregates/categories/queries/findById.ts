import { QueryById, AppError, QueryOperators } from '@app/core';
import { categoriesRepository } from '../repository';
import { Category } from '../interfaces';
import { postsRepository } from '../../posts/repository';

export const handler = async (query: QueryById): Promise<Category | undefined> => {
  if (!query.id) {
    throw new AppError('Category ID is required', 'posts/missing-category-id');
  }

  const [result, totalPosts] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    categoriesRepository.findById!(query.id),
    postsRepository.countPosts([
      {
        field: 'categoryId',
        operator: QueryOperators.equals,
        value: query.id,
      },
    ]),
  ]);

  if (result) {
    return {
      ...result,
      totalPosts: totalPosts || 0,
    };
  }

  return undefined;
};
