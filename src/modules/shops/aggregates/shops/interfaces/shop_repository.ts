import { Repository } from '@app/core';
import { Shop } from '.';

export type ShopRepository = Repository<Shop> & {
  findRandom(): Promise<Shop>;
};
