import { Context, MutationResult, validateAuthenticate } from '@app/core';
import faker from 'faker';
import { v4 } from 'uuid';
import moment from 'moment';
import { SeedPostsPayload, Post, MachineConditions, PriceTypes, PostTypes, PostStatuses } from '../interfaces';
import { postsRepository } from '../repository';
import { usersRepository } from '../../../../auth/aggregates/users/repository';
import { shopsRepository } from '../../../../shops/aggregates/shops/repository';
import { provincesRepository } from '../../provinces/repository';
import { categoriesRepository } from '../../categories/repository';
import { brandsRepository } from '../../brands/repository';
import { modelsRepository } from '../../models/repository';

export const handler = async (payload: SeedPostsPayload, context: Context): Promise<MutationResult<Post>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Update db
  const createProvincePromises: Promise<Post>[] = [];
  const machineConditions = [MachineConditions.LIQUIDATE, MachineConditions.NEW, MachineConditions.USED];
  const priceTypes = [PriceTypes.FIXED, PriceTypes.NEGOTIATE];
  const postTypes = [PostTypes.BUY, PostTypes.LEASE, PostTypes.RENT, PostTypes.SELL];

  for (let i = 0; i < payload.numberOfPosts; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const [owner, shop, province, category, brand, model] = await Promise.all([
      usersRepository.findRandom(),
      shopsRepository.findRandom(),
      provincesRepository.findRandom(),
      categoriesRepository.findRandom(),
      brandsRepository.findRandom(),
      modelsRepository.findRandom(),
    ]);

    createProvincePromises.push(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      postsRepository.create!({
        id: v4(),
        title: faker.commerce.productName(),
        conditions: machineConditions[Math.floor(Math.random() * machineConditions.length)],
        description: faker.lorem.paragraph(),
        price: (Math.floor(Math.random() * (5000000 - 500000 + 1)) + 500000) * 1000,
        priceType: priceTypes[Math.floor(Math.random() * priceTypes.length)],
        postType: postTypes[Math.floor(Math.random() * postTypes.length)],
        ownerId: owner.id,
        shopId: shop.id,
        provinceId: province.id,
        status: PostStatuses.PUBLIC,
        usedHours: Math.floor(Math.random() * 10000) + 1000,
        serialNo: new Date().getTime().toString(),
        categoryId: category.id,
        brandId: brand.id,
        modelId: model.id,
        weight: Math.floor(Math.random() * 10000) + 1000,
        releasedYear: (Math.floor(Math.random() * (2020 - 1980 + 1)) + 1980).toString(),
        reviewedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        reviewedBy: owner.id,
      }),
    );
  }

  return Promise.all(createProvincePromises);
};
