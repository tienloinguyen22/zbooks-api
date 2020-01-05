import * as yup from 'yup';
import { CommandResult, Context, WithoutCommandId, getFieldExistedErrorMessage, handleUpdateCommand } from '@app/core';
import { config } from '@app/config';
import { UpdateRoleCommand, RoleRepository as RolesRepository } from '../interfaces';

export const handler = async (command: UpdateRoleCommand, context: Context): Promise<CommandResult> => {
  const repository = context.dataSources.roles as RolesRepository;
  const schema = yup.object().shape<WithoutCommandId<UpdateRoleCommand>>({
    id: yup.string().required(),
    name: yup
      .string()
      .required()
      .max(config.validation.string.maxLength)
      .test('UNIQUE', getFieldExistedErrorMessage('name'), async (value: string) => {
        const existedCount = await repository.count([
          {
            field: 'id',
            operator: 'ne',
            value: command.id,
          },
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
  return handleUpdateCommand(command, context, repository, schema);
};
