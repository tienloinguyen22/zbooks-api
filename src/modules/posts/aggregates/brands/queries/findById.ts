import { QueryById, AppError } from '@app/core';
import { brandsRepository } from '../repository';
import { Brand } from '../interfaces';

export const handler = async (query: QueryById): Promise<Brand | undefined> => {
  if (!query.id) {
    throw new AppError('Brand ID is required', 'posts/missing-brand-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await brandsRepository.findById!(query.id);
  return result;
};
