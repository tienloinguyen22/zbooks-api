import { Repository, Aggregate } from '../interfaces';
import { validateEntityExisting } from './validate_entity_existing';

export const handleDeleteCommand = async <T extends Aggregate>(
  id: string,
  repository: Repository<T>,
): Promise<{ id: string }> => {
  await validateEntityExisting(id, repository);
  await repository.delete(id);
  return {
    id,
  };
};
