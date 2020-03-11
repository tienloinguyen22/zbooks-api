import { Aggregate, IsAuditable } from '@app/core';

export interface Model extends Aggregate, IsAuditable {
  name: string;
  slug: string;
  brandId: string; // Reference Brand table
  categoryId: string; // Reference Category table
}
