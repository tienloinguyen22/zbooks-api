import { Aggregate, IsAuditable } from '@app/core';

export interface ShopImage extends Aggregate, IsAuditable {
  imageUrl: string;
  shopId: string;
}
