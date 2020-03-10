import { QueryById, AppError } from '@app/core';
import { User } from '../interfaces';
import { usersRepository } from '../repository';

export const handler = async (query: QueryById): Promise<User | undefined> => {
  if (!query.id) {
    throw new AppError('User ID is required', 'auth/missing-user-id');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await usersRepository.findById!(query.id);
  return result;
};
