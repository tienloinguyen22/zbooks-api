import { QueryById, AppError } from '@app/core';
import { provincesRepository } from '../repository';
import { Province } from '../interfaces';

export const handler = async (query: QueryById): Promise<Province | undefined> => {
  if (!query.id) {
    throw new AppError('Province ID is required', 'posts/missing-province-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await provincesRepository.findById!(query.id);
  return result;
};
