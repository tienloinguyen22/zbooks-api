import { AuthUser } from './auth_user';
import { Repository } from './repository';

export type Context = {
  user?: AuthUser;
  fields: Record<string, 0 | 1>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSources: { [repoName: string]: Repository<any> };
};
