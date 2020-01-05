import admin from 'firebase-admin';
import { AuthUser } from '../interfaces';
import { AppError } from './app_error';

export const validateToken = async (token: string): Promise<AuthUser | undefined> => {
  if (!token) {
    return undefined;
  }
  try {
    const { id, name, roles } = await admin.auth().verifyIdToken(token);
    return {
      id,
      name,
      roles,
    };
  } catch (err) {
    throw new AppError('Invalid token', 'INVALID_TOKEN');
  }
};
