import { Aggregate, IsAuditable } from '@app/core';

export interface Shop extends Aggregate, IsAuditable {
  name: string;
  domain: string;
  ownerId: string;
  address: string;
  longtitude: string;
  latitude: string;
  description: string;
  phoneNo: string;
  email: string;
  logoUrl: string;
  isActive: boolean;
}
