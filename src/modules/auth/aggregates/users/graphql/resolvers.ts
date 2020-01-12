import { LoginTypes } from '@app/core';

export const resolvers = {
  ExternalLogin: {
    __resolveType: (login: { loginType: string }): string => {
      switch (login.loginType) {
        case LoginTypes.facebook:
          return 'FacebookLogin';
        case LoginTypes.google:
          return 'GoogleLogin';
        default:
          return 'FacebookLogin';
      }
    },
  },
};
