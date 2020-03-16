import { Repository } from '@app/core';
import { Brand } from '.';

export type BrandRepository = Repository<Brand> & {
  findRandom(): Promise<Brand>;
};
