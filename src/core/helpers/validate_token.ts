import admin from 'firebase-admin';
import { UserRepository } from '@app/modules/auth/aggregates/users/interfaces';
import { AuthUser, MongoQueryOperators } from '../interfaces';
import { AppError } from './app_error';

export const validateToken = async (token: string, usersRespository: UserRepository): Promise<AuthUser | undefined> => {
  if (!token) {
    return undefined;
  }

  try {
    const verifyIdTokenResult = await admin.auth().verifyIdToken(token);
    const user = await usersRespository.findOne([
      {
        field: 'firebaseId',
        operator: MongoQueryOperators.equals,
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
    return undefined;
  } catch (err) {
    throw new AppError('Invalid token', 'INVALID_TOKEN');
  }
};
