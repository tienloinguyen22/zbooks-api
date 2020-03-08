import * as yup from 'yup';
import admin from 'firebase-admin';
import { Context, validateSchema, AppError, addCreationInfo, LoginTypes, WithoutId, MutationResult } from '@app/core';
import { config } from '@app/config';
import { RegisterWithTokenPayload, ExternalLogin, User } from '../interfaces';
import { usersRepository } from '../repository';

export const handler = async (payload: RegisterWithTokenPayload, context: Context): Promise<MutationResult<User>> => {
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
  let loginDetail: ExternalLogin;

  try {
    const decodeFirebaseTokenInfo = await admin.auth().verifyIdToken(payload.token);
    firebaseUser = await admin.auth().getUser(decodeFirebaseTokenInfo.uid);
  } catch (err) {
    throw new AppError(err.message, err.code);
  }

  const providerData = firebaseUser.providerData[0];
  if (providerData.providerId === 'google.com') {
    loginDetail = {
      loginType: LoginTypes.google,
      uid: providerData.uid,
    };
  } else if (providerData.providerId === 'facebook.com') {
    loginDetail = {
      loginType: LoginTypes.facebook,
      uid: providerData.uid,
    };
  } else {
    throw new AppError('Invalid login provider', 'auth/invalid-auth-provider');
  }

  // 3. Save to db
  const user: WithoutId<User> = {
    firebaseId: firebaseUser.uid,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    email: payload.email,
    fullName: payload.fullName,
    loginDetail,
    isActive: true,
    ...addCreationInfo(context),
  };
  const newUser = await usersRepository.create(user);
  return newUser;
};
