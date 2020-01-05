import { Command } from '../interfaces';

export const withoutCommandId = <T extends Command>(command: T): Omit<T, 'commandId'> => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { commandId, ...data } = command;
  return data;
};
