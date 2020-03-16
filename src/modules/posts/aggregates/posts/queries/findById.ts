import { QueryById, AppError } from '@app/core';
import { postsRepository } from '../repository';
import { Post } from '../interfaces';

export const handler = async (query: QueryById): Promise<Post | undefined> => {
  if (!query.id) {
    throw new AppError('Post ID is required', 'posts/missing-post-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await postsRepository.findById!(query.id);
  return result;
};
