import * as yup from 'yup';
import { Command, Repository, Aggregate, WithoutCommandId, Context } from '../interfaces';
import { validateEntityExisting } from './validate_entity_existing';
import { validateUpdatedSchema } from './validate_updated_schema';
import { withoutCommandId } from './without_command_id';

export const handleUpdateCommand = async <T extends Command & { id: string }, K extends Aggregate>(
  command: T,
  _context: Context,
  repository: Repository<K>,
  schema: yup.ObjectSchema<yup.Shape<object, WithoutCommandId<T>>>,
): Promise<{ id: string }> => {
  await validateEntityExisting(command.id, repository);
  await validateUpdatedSchema(schema, command);
  await repository.update({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(withoutCommandId(command) as any),
  });
  return {
    id: command.id,
  };
};
