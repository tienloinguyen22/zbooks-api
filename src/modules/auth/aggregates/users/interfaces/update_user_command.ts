import { Command, GUID } from '@app/core';

export interface UpdateUserCommand extends Command {
  id: GUID;
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNo?: string;
  address?: string;
  avatarUrl?: string;
  dob?: string;
  gender?: string;
  roles?: string[];
  isActive?: boolean;
}
