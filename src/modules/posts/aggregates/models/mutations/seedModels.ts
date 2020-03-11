import { Context, MutationResult, validateAuthenticate, AppError, PaginationTypes } from '@app/core';
import faker from 'faker';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { SeedModelsPayload, Model } from '../interfaces';
import { modelsRepository } from '../repository';
import { brandsRepository } from '../../brands/repository';
import { categoriesRepository } from '../../categories/repository';

export const handler = async (payload: SeedModelsPayload, context: Context): Promise<MutationResult<Model>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  if (payload.numberOfModels < 0) {
    throw new AppError('Invalid number of models to generate', 'posts/invalid-number-of-models');
  }
  const numberOfUsers = payload.numberOfModels > 1000 ? 1000 : payload.numberOfModels;

  // 3. Get all brands, categories
  const [brands, categories] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    brandsRepository.findWithOffsetPagination!({
      type: PaginationTypes.OFFSET,
      itemsPerPage: 1000,
      pageIndex: 0,
    }),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    categoriesRepository.findWithOffsetPagination!({
      type: PaginationTypes.OFFSET,
      itemsPerPage: 1000,
      pageIndex: 0,
    }),
  ]);

  // 3. Update db
  const createModelPromises: Promise<Model>[] = [];
  for (let i = 0; i < numberOfUsers; i += 1) {
    const name = faker.address.city();
    const slug = slugify(name.toLowerCase());

    createModelPromises.push(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      modelsRepository.create!({
        id: v4(),
        name,
        slug,
        brandId: brands.data[Math.floor(Math.random() * brands.data.length)].id,
        categoryId: categories.data[Math.floor(Math.random() * categories.data.length)].id,
      }),
    );
  }

  return Promise.all(createModelPromises);
};
