import admin from 'firebase-admin';
import { AuthUser, QueryOperators } from '../interfaces';
import { AppError } from './app_error';
import { usersRepository } from '../../modules/auth/aggregates/users/repository';

export const validateToken = async (token: string): Promise<AuthUser | undefined> => {
  if (!token) {
    return undefined;
  }

  try {
    const verifyIdTokenResult = await admin.auth().verifyIdToken(token);

    if (usersRepository.findOne) {
      const user = await usersRepository.findOne([
        {
          field: 'firebaseId',
          operator: QueryOperators.equals,
          value: verifyIdTokenResult.uid,
        },
      ]);

      if (user) {
        return {
          id: user.id,
          fullName: user.fullName,
          roles: [],
        };
      }
    }

    return undefined;
  } catch (err) {
    throw new AppError('Invalid token', 'INVALID_TOKEN');
  }
};
