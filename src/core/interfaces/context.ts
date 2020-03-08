import { AuthUser } from './auth_user';

export type Context = {
  user?: AuthUser;
  fields: Record<string, 0 | 1>;
};
