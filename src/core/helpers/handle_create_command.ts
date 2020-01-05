import * as yup from 'yup';
import { Command, Repository, Aggregate, WithoutCommandId, Context } from '../interfaces';
import { withoutCommandId } from './without_command_id';
import { validateSchema } from './validate_schema';

export const handleCreateCommand = async <T extends Command, K extends Aggregate>(
  command: T,
  _context: Context,
  repository: Repository<K>,
  schema: yup.ObjectSchema<yup.Shape<object, WithoutCommandId<T>>>,
): Promise<{ id: string }> => {
  await validateSchema(schema, command);
  return repository.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(withoutCommandId(command) as any),
  });
};
