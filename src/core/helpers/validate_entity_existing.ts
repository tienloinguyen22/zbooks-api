import { Repository, Aggregate } from '../interfaces';
import { AppError } from './app_error';

export const validateEntityExisting = async <T extends Aggregate>(
  id: string,
  repository: Repository<T>,
): Promise<T> => {
  const entity = await repository.findById(id);
  if (!entity) {
    throw new AppError('Entity not found', 'ENTITY_NOT_FOUND');
  }
  return entity;
};
