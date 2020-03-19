import { Aggregate, IsAuditable } from '@app/core';

export interface Category extends Aggregate, IsAuditable {
  name: string;
  slug: string;
  imageUrl: string;
  totalPosts: number;
}
