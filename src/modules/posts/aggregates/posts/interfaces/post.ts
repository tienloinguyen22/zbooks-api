import { Aggregate, IsAuditable } from '@app/core';

export enum MachineConditions {
  NEW = 'NEW',
  USED = 'USED',
  LIQUIDATE = 'LIQUIDATE',
}

export enum PriceTypes {
  FIXED = 'FIXED',
  NEGOTIATE = 'NEGOTIATE',
}

export enum PostTypes {
  BUY = 'BUY',
  SELL = 'SELL',
  RENT = 'RENT',
  LEASE = 'LEASE',
}

export enum PostStatuses {
  REVIEWING = 'REVIEWING',
  DELETED = 'DELETED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  PUBLIC = 'PUBLIC',
}

export interface Post extends Aggregate, IsAuditable {
  title: string;
  conditions: MachineConditions;
  description: string;
  priceType: PriceTypes;
  price?: number;
  postType: PostTypes;
  ownerId: string;
  shopId?: string;
  provinceId: string;
  status: PostStatuses;
  usedHours?: number;
  serialNo?: string;
  categoryId: string;
  brandId: string;
  modelId?: string;
  weight?: number;
  releasedYear: string;
  reviewedAt: string;
  reviewedBy: string;
}
