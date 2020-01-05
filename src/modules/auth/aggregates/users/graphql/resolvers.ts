export const resolvers = {
  ExternalLogin: {
    __resolveType: (login: { loginType: string }): string => {
      switch (login.loginType) {
        case 'FACEBOOK':
          return 'FacebookLogin';
        case 'GOOGLE':
          return 'GoogleLogin';
        case 'PHONE_NO':
          return 'PhoneNoLogin';
        default:
          return 'EmailLogin';
      }
    },
  },
};
