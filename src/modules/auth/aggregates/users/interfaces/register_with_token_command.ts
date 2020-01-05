import { Command } from '@app/core';

export interface RegisterWithTokenCommand extends Command {
  token: string;
}
