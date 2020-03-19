import { Context, MutationResult, validateAuthenticate, AppError } from '@app/core';
import faker from 'faker';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { SeedCategoriesPayload, Category } from '../interfaces';
import { categoriesRepository } from '../repository';

export const handler = async (
  payload: SeedCategoriesPayload,
  context: Context,
): Promise<MutationResult<Category>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  if (payload.numberOfCategories < 0) {
    throw new AppError('Invalid number of categories to generate', 'posts/invalid-number-of-categories');
  }
  const numberOfUsers = payload.numberOfCategories > 1000 ? 1000 : payload.numberOfCategories;

  // 3. Update db
  const createProvincePromises: Promise<Category>[] = [];
  for (let i = 0; i < numberOfUsers; i += 1) {
    const name = faker.address.city();
    const slug = slugify(name.toLowerCase());

    createProvincePromises.push(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      categoriesRepository.create!({
        id: v4(),
        name,
        slug,
        imageUrl: faker.image.imageUrl(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    );
  }

  return Promise.all(createProvincePromises);
};
