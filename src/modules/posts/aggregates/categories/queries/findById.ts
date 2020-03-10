import { QueryById, AppError } from '@app/core';
import { categoriesRepository } from '../repository';
import { Category } from '../interfaces';

export const handler = async (query: QueryById): Promise<Category | undefined> => {
  if (!query.id) {
    throw new AppError('Category ID is required', 'posts/missing-category-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await categoriesRepository.findById!(query.id);
  return result;
};
