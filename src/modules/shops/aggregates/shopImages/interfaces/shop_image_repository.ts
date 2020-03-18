import { Repository } from '@app/core';
import { ShopImage } from '.';

export type ShopImageRepository = Repository<ShopImage> & {
  findAllByShopId: (shopId: string) => Promise<ShopImage[]>;
};
