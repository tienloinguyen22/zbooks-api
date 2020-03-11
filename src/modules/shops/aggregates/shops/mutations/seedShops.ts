import { Context, MutationResult, validateAuthenticate, AppError, PaginationTypes } from '@app/core';
import faker from 'faker';
import { v4 } from 'uuid';
import { SeedShopsPayload, Shop } from '../interfaces';
import { shopsRepository } from '../repository';
import { usersRepository } from '../../../../auth/aggregates/users/repository';

export const handler = async (payload: SeedShopsPayload, context: Context): Promise<MutationResult<Shop>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  if (payload.numberOfShops < 0) {
    throw new AppError('Invalid number of brands to generate', 'posts/invalid-number-of-brands');
  }
  const numberOfUsers = payload.numberOfShops > 1000 ? 1000 : payload.numberOfShops;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const users = await usersRepository.findWithOffsetPagination!({
    type: PaginationTypes.OFFSET,
    itemsPerPage: 1000,
    pageIndex: 0,
  });

  // 3. Update db
  const createShopPromises: Promise<Shop>[] = [];
  for (let i = 0; i < numberOfUsers; i += 1) {
    createShopPromises.push(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shopsRepository.create!({
        id: v4(),
        name: faker.company.companyName(),
        domain: faker.internet.domainName(),
        ownerId: users.data[Math.floor(Math.random() * users.data.length)].id,
        address: `${faker.address.streetAddress()}, ${faker.address.city()}`,
        longtitude: faker.address.longitude(),
        latitude: faker.address.latitude(),
        description: faker.lorem.paragraph(),
        phoneNo: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        logoUrl: faker.image.imageUrl(),
        isActive: true,
      }),
    );
  }

  return Promise.all(createShopPromises);
};
