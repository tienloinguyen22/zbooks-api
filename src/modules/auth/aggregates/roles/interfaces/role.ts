import { Aggregate, IsAuditable } from '@app/core';

export interface Role extends Aggregate, IsAuditable {
  name: string;
  description: string;
  permissions: string[];
}
