import { QueryById, AppError, QueryOperators } from '@app/core';
import { provincesRepository } from '../repository';
import { Province } from '../interfaces';
import { postsRepository } from '../../posts/repository';

export const handler = async (query: QueryById): Promise<Province | undefined> => {
  if (!query.id) {
    throw new AppError('Province ID is required', 'posts/missing-province-id');
  }

  const [result, totalPosts] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    provincesRepository.findById!(query.id),
    postsRepository.countPosts([
      {
        field: 'provinceId',
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
