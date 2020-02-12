import { AppError, AuthUser } from '@app/core';

export const validateAuthenticate = (currentUser: AuthUser | undefined): void => {
  if (!currentUser || !currentUser.id) {
    throw new AppError('Not authenticate', 'auth/not-authenticate');
  }
};
