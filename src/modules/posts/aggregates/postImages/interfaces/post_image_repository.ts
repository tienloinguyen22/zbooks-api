import { Repository } from '@app/core';
import { PostImage } from '.';

export type PostImageRepository = Repository<PostImage> & {
  findAllByPostId: (postId: string) => Promise<PostImage[]>;
};
