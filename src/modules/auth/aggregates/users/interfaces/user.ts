import { Aggregate, IsAuditable, ISODate, Genders, LoginTypes } from '@app/core';

export interface User extends Aggregate, IsAuditable {
  email: string;
  fullName: string;
  countryCode?: string;
  phoneNo?: string;
  address?: string;
  avatarUrl?: string;
  dob?: ISODate;
  gender?: Genders;
  loginUid: string;
  loginType: LoginTypes;
  isActive: boolean;
  lastLoggedInAt?: ISODate;
  firebaseId: string;
}
