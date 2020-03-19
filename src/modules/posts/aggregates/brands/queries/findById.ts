import { QueryById, AppError, QueryOperators } from '@app/core';
import { brandsRepository } from '../repository';
import { Brand } from '../interfaces';
import { postsRepository } from '../../posts/repository';

export const handler = async (query: QueryById): Promise<Brand | undefined> => {
  if (!query.id) {
    throw new AppError('Brand ID is required', 'posts/missing-brand-id');
  }

  const [result, totalPosts] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    brandsRepository.findById!(query.id),
    postsRepository.countPosts([
      {
        field: 'brandId',
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
