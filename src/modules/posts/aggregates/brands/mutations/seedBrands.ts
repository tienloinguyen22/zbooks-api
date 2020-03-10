import { Context, MutationResult, validateAuthenticate, AppError } from '@app/core';
import faker from 'faker';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { SeedBrandsPayload, Brand } from '../interfaces';
import { brandsRepository } from '../repository';

export const handler = async (payload: SeedBrandsPayload, context: Context): Promise<MutationResult<Brand>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  if (payload.numberOfBrands < 0) {
    throw new AppError('Invalid number of brands to generate', 'posts/invalid-number-of-provinces');
  }
  const numberOfUsers = payload.numberOfBrands > 1000 ? 1000 : payload.numberOfBrands;

  // 3. Update db
  const createProvincePromises: Promise<Brand>[] = [];
  for (let i = 0; i < numberOfUsers; i += 1) {
    const name = faker.address.city();
    const slug = slugify(name.toLowerCase());

    createProvincePromises.push(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      brandsRepository.create!({
        id: v4(),
        name,
        slug,
        imageUrl: faker.image.imageUrl(),
      }),
    );
  }

  return Promise.all(createProvincePromises);
};
