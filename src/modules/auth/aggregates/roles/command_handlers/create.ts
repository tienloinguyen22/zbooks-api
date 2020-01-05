import * as yup from 'yup';
import { CommandResult, Context, WithoutCommandId, getFieldExistedErrorMessage, handleCreateCommand } from '@app/core';
import { config } from '@app/config';
import { CreateRoleCommand } from '../interfaces';
import { RolesRepository } from '../repository';

export const handler = async (command: CreateRoleCommand, context: Context): Promise<CommandResult> => {
  const repository = context.dataSources.roles as RolesRepository;
  const schema = yup.object().shape<WithoutCommandId<CreateRoleCommand>>({
    name: yup
      .string()
      .required()
      .max(config.validation.string.maxLength)
      .test('UNIQUE', getFieldExistedErrorMessage('name'), async (value: string) => {
        const existedCount = await repository.count([
          {
            field: 'name',
            operator: 'equals',
            value,
          },
        ]);
        return existedCount === 0;
      }),
    description: yup
      .string()
      .required()
      .max(config.validation.string.descriptionMaxLength),
    permissions: yup.array().of(yup.string().required()),
  });

  return handleCreateCommand(command, context, repository, schema);
};
