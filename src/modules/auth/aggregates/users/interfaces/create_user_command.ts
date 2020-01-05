import { Command } from '@app/core';

export interface CreateUserCommand extends Command {
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNo?: string;
  address?: string;
  avatarUrl?: string;
  dob?: string;
  gender?: string;
  roles?: string[];
  isActive: boolean;
}
