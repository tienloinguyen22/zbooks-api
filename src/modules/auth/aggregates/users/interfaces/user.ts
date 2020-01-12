import { Aggregate, IsAuditable, ISODate, Genders, LoginTypes } from '@app/core';

export type ExternalLogin = {
  uid: string;
  loginType: LoginTypes;
};

export interface User extends Aggregate, IsAuditable {
  email: string;
  fullName: string;
  countryCode?: string;
  lineNumber?: string;
  phoneNo?: string; // countryCode + lineNumber
  address?: string;
  avatarUrl?: string;
  dob?: ISODate;
  gender?: Genders;
  loginDetail: ExternalLogin;
  isActive: boolean;
  lastLoggedInAt?: ISODate;
}
