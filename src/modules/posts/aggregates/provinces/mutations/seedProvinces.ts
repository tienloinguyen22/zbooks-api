import { Context, MutationResult, validateAuthenticate, AppError } from '@app/core';
import faker from 'faker';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { SeedProvincesPayload, Province } from '../interfaces';
import { provincesRepository } from '../repository';

export const handler = async (payload: SeedProvincesPayload, context: Context): Promise<MutationResult<Province>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  if (payload.numberOfProvinces < 0) {
    throw new AppError('Invalid number of provinces to generate', 'posts/invalid-number-of-provinces');
  }
  const numberOfUsers = payload.numberOfProvinces > 1000 ? 1000 : payload.numberOfProvinces;

  // 3. Update db
  const createProvincePromises: Promise<Province>[] = [];
  for (let i = 0; i < numberOfUsers; i += 1) {
    const name = faker.address.city();
    const slug = slugify(name.toLowerCase());
    createProvincePromises.push(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      provincesRepository.create!({
        id: v4(),
        name,
        slug,
      }),
    );
  }

  return Promise.all(createProvincePromises);
};
