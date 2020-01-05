import { Command } from '@app/core';

export interface CreateRoleCommand extends Command {
  name: string;
  description: string;
  permissions: string[];
}
