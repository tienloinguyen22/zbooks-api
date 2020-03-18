import { Repository, Condition } from '@app/core';
import { Post } from '.';

export type PostRepository = Repository<Post> & {
  findRandom(): Promise<Post>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countPosts(conditions: Condition<any>[]): Promise<number>;
};
