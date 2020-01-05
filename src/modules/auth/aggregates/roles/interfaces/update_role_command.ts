import { Command, GUID } from '@app/core';

export interface UpdateRoleCommand extends Command {
  id: GUID;
  name?: string;
  description?: string;
  permissions?: string[];
}
