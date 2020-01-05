import { CommandResult, Context, DeleteCommand, handleDeleteCommand } from '@app/core';

export const handler = async ({ id }: DeleteCommand, context: Context): Promise<CommandResult> =>
  handleDeleteCommand(id, context.dataSources.roles);
