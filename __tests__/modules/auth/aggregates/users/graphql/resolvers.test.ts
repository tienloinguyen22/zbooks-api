import { resolvers } from '@app/modules/auth/aggregates/users/graphql/resolvers';

describe('@app/modules/auth/aggregates/users/graphql/resolvers', () => {
  describe('ExternalLogin', () => {
    it('returns undefined', async () => {
      const result = resolvers.ExternalLogin.__resolveType({
        loginType: 'FACEBOOK',
      });
      expect(result).toMatchInlineSnapshot(`"FacebookLogin"`);
    });
  });
});

export {};
