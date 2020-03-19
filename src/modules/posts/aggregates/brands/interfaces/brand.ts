import { Aggregate, IsAuditable } from '@app/core';

export interface Brand extends Aggregate, IsAuditable {
  name: string;
  slug: string;
  imageUrl: string;
  totalPosts: number;
}
