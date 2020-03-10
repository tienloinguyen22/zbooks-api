import { Aggregate, IsAuditable } from '@app/core';

export interface Province extends Aggregate, IsAuditable {
  name: string;
  slug: string;
}
