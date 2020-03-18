import { Context, MutationResult, validateAuthenticate } from '@app/core';
import faker from 'faker';
import { v4 } from 'uuid';
import { PostImage, SeedPostImagesPayload } from '../interfaces';
import { postsRepository } from '../../posts/repository';
import { postImagesRepository } from '../repository';

export const handler = async (
  payload: SeedPostImagesPayload,
  context: Context,
): Promise<MutationResult<PostImage>[]> => {
  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Update db
  const postImages: PostImage[] = [];
  for (let i = 0; i < payload.numberOfImages; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const post = await postsRepository.findRandom();
    // eslint-disable-next-line no-await-in-loop
    const existedPostImages = await postImagesRepository.findAllByPostId(post.id);

    if (existedPostImages && existedPostImages.length < 15) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, no-await-in-loop
      const newPostImage = await postImagesRepository.create!({
        id: v4(),
        imageUrl: faker.image.imageUrl(),
        postId: post.id,
      });
      postImages.push(newPostImage);
    }
  }

  return postImages;
};
