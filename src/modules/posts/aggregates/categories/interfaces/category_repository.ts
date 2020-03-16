import { Repository } from '@app/core';
import { Category } from '.';

export type CategoryRepository = Repository<Category> & {
  findRandom(): Promise<Category>;
};
