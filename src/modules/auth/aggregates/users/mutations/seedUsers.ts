import { validateAuthenticate, Context, MutationResult, AppError, LoginTypes } from '@app/core';
import faker from 'faker';
import admin from 'firebase-admin';
import { v4 } from 'uuid';
import { User, SeedUsersPayload } from '../interfaces';
import { usersRepository } from '../repository';

const createFirebaseAndMongoUser = async (): Promise<User> => {
  const user: Partial<User> = {
    id: v4(),
    email: faker.internet.email(),
    fullName: faker.name.firstName(),
    address: faker.address.streetAddress(),
    avatarUrl: faker.image.avatar(),
    isActive: true,
  };

  try {
    const firebaseUser = await admin.auth().createUser({
      email: user.email,
      password: 'tienloi22',
      emailVerified: true,
    });

    user.loginUid = firebaseUser.uid;
    user.loginType = [LoginTypes.facebook, LoginTypes.google][Math.floor(Math.random() * 2)];
    user.firebaseId = firebaseUser.uid;
  } catch (error) {
    throw new AppError(error.message, 'auth/invalid-firebase-info');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
  return usersRepository.create!(user as any);
};

export const handler = async (payload: SeedUsersPayload, context: Context): Promise<MutationResult<User>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  if (payload.numberOfUsers < 0) {
    throw new AppError('Invalid number of users to generate', 'auth/invalid-number-of-users');
  }
  const numberOfUsers = payload.numberOfUsers > 1000 ? 1000 : payload.numberOfUsers;

  // 3. Update db
  const createUserPromises: Promise<User>[] = [];
  for (let i = 0; i < numberOfUsers; i += 1) {
    createUserPromises.push(createFirebaseAndMongoUser());
  }

  return Promise.all(createUserPromises);
};
