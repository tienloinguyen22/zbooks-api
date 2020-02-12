import { Context, validateAuthenticate } from '@app/core';
import _ from 'lodash';
import { User, UserRepository } from '../interfaces';

export const handler = async (query: {}, context: Context): Promise<User | undefined> => {
  const repository: UserRepository = context.dataSources.users;

  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Query database
  const id = _.get(context, 'user.id');
  const user = await repository.findById(id);
  return user;
};
