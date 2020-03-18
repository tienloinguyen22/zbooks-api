import { Aggregate, IsAuditable } from '@app/core';

export interface PostImage extends Aggregate, IsAuditable {
  imageUrl: string;
  postId: string;
}
