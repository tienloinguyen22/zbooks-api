import * as yup from 'yup';
import admin from 'firebase-admin';
import {
  CommandResult,
  Context,
  validateSchema,
  WithoutCommandId,
  AppError,
  addCreationInfo,
  LoginTypes,
  WithoutId,
} from '@app/core';
import { config } from '@app/config';
import { UserRepository, RegisterWithTokenCommand, ExternalLogin, User } from '../interfaces';

export const handler = async (command: RegisterWithTokenCommand, context: Context): Promise<CommandResult> => {
  const repository: UserRepository = context.dataSources.users;

  // 1. Validate
  await validateSchema(
    yup.object().shape<WithoutCommandId<RegisterWithTokenCommand>>({
      token: yup.string().required('auth/missing-token'),
      email: yup
        .string()
        .required('auth/missing-email')
        .matches(config.regex.email, 'auth/invalid-email'),
      fullName: yup.string().required('auth/missing-full-name'),
    }),
    command,
  );

  // 2. Build User record
  let firebaseUser: admin.auth.UserRecord;
  let loginDetail: ExternalLogin;

  try {
    const decodeFirebaseTokenInfo = await admin.auth().verifyIdToken(command.token);
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
    email: command.email,
    fullName: command.fullName,
    loginDetail,
    isActive: true,
    ...addCreationInfo(context),
  };
  const { id } = await repository.create(user);

  return {
    id,
  };
};
