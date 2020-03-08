import { Context, validateAuthenticate } from '@app/core';
import _ from 'lodash';
import { User } from '../interfaces';
import { usersRepository } from '../repository';

export const handler = async (_query: {}, context: Context): Promise<User | undefined> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Query database
  const id = _.get(context, 'user.id');
  const user = await usersRepository.findById(id);
  return user;
};
