import { Context, MutationResult, validateAuthenticate } from '@app/core';
import faker from 'faker';
import { v4 } from 'uuid';
import { SeedShopImagesPayload, ShopImage } from '../interfaces';
import { shopsRepository } from '../../shops/repository';
import { shopImagesRepository } from '../repository';

export const handler = async (
  payload: SeedShopImagesPayload,
  context: Context,
): Promise<MutationResult<ShopImage>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Update db
  const shopImages: ShopImage[] = [];
  for (let i = 0; i < payload.numberOfImages; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const shop = await shopsRepository.findRandom();
    // eslint-disable-next-line no-await-in-loop
    const existedShopImages = await shopImagesRepository.findAllByShopId(shop.id);

    if (existedShopImages && existedShopImages.length < 15) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, no-await-in-loop
      const newShopImage = await shopImagesRepository.create!({
        id: v4(),
        imageUrl: faker.image.imageUrl(),
        shopId: shop.id,
      });
      shopImages.push(newShopImage);
    }
  }

  return shopImages;
};
