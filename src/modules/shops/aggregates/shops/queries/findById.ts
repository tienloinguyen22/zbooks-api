import { QueryById, AppError } from '@app/core';
import { shopsRepository } from '../repository';
import { Shop } from '../interfaces';

export const handler = async (query: QueryById): Promise<Shop | undefined> => {
  if (!query.id) {
    throw new AppError('Category ID is required', 'posts/missing-category-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await shopsRepository.findById!(query.id);
  return result;
};
