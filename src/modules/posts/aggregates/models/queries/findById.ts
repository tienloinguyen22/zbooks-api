import { QueryById, AppError } from '@app/core';
import { modelsRepository } from '../repository';
import { Model } from '../interfaces';

export const handler = async (query: QueryById): Promise<Model | undefined> => {
  if (!query.id) {
    throw new AppError('Model ID is required', 'posts/missing-model-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await modelsRepository.findById!(query.id);
  return result;
};
