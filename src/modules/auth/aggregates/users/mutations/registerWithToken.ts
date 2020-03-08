import * as yup from 'yup';
import admin from 'firebase-admin';
import { validateSchema, AppError, LoginTypes, MutationResult } from '@app/core';
import { config } from '@app/config';
import { v4 } from 'uuid';
import { RegisterWithTokenPayload, User } from '../interfaces';
import { usersRepository } from '../repository';

export const handler = async (payload: RegisterWithTokenPayload): Promise<MutationResult<User>> => {
  // 1. Validate
  await validateSchema(
    yup.object().shape<RegisterWithTokenPayload>({
      token: yup.string().required('auth/missing-token'),
      email: yup
        .string()
        .required('auth/missing-email')
        .matches(config.regex.email, 'auth/invalid-email'),
      fullName: yup.string().required('auth/missing-full-name'),
    }),
    payload,
  );

  // 2. Build User record
  let firebaseUser: admin.auth.UserRecord;

  try {
    const decodeFirebaseTokenInfo = await admin.auth().verifyIdToken(payload.token);
    firebaseUser = await admin.auth().getUser(decodeFirebaseTokenInfo.uid);
  } catch (err) {
    throw new AppError(err.message, err.code);
  }

  const providerData = firebaseUser.providerData[0];
  let loginType = LoginTypes.google;
  let loginUid = providerData.uid;
  if (providerData.providerId === 'google.com') {
    loginType = LoginTypes.google;
    loginUid = providerData.uid;
  } else if (providerData.providerId === 'facebook.com') {
    loginType = LoginTypes.facebook;
    loginUid = providerData.uid;
  }

  // 3. Save to db
  const user: User = {
    id: v4(),
    firebaseId: firebaseUser.uid,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    email: payload.email,
    fullName: payload.fullName,
    isActive: true,
    loginType,
    loginUid,
  };
  return usersRepository.create(user);
};
