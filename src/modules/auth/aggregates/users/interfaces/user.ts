import { Aggregate, IsAuditable, TimestampInDays, TimestampInMilliseconds } from '@app/core';

interface FacebookLogin {
  uid: string;
  email: string;
  loginType: 'FACEBOOK';
}

interface GoogleLogin {
  uid: string;
  email: string;
  loginType: 'GOOGLE';
}

interface PhoneLogin {
  phoneNo: string;
  loginType: 'PHONE_NO';
}

interface EmailLogin {
  email: string;
  loginType: 'EMAIL';
}

export type ExternalLogin = FacebookLogin | GoogleLogin | PhoneLogin | EmailLogin;

export interface User extends Aggregate, IsAuditable {
  username?: string;
  email?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  phoneNo?: string;
  address?: string;
  avatarUrl?: string;
  dob?: TimestampInDays;
  gender?: string;
  loginDetail: ExternalLogin;
  roles: string[];
  isActive: boolean;
  lastLoggedInAt?: TimestampInMilliseconds;
  firebaseId: string;
}
