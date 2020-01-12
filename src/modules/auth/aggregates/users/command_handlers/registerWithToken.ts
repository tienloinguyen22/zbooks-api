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
} from '@app/core';
import { UserRepository, RegisterWithTokenCommand, ExternalLogin } from '../interfaces';

export const handler = async (command: RegisterWithTokenCommand, context: Context): Promise<CommandResult> => {
  const repository: UserRepository = context.dataSources.users;

  // 1. Validate
  await validateSchema(
    yup.object().shape<WithoutCommandId<RegisterWithTokenCommand>>({
      token: yup.string().required(),
    }),
    command,
  );

  let firebaseUser: admin.auth.UserRecord;
  let loginDetail: ExternalLogin;
  let phoneNo: string | undefined;
  let email: string | undefined;

  try {
    const { uid } = await admin.auth().verifyIdToken(command.token);
    firebaseUser = await admin.auth().getUser(uid);
  } catch (err) {
    const code = err.code.replace(/[/,-]/g, '_').toUpperCase();
    throw new AppError(err.message, code);
  }

  const providerData = firebaseUser.providerData[0];
  if (providerData.providerId === 'google.com') {
    email = providerData.email;
    loginDetail = {
      loginType: LoginTypes.google,
      uid: providerData.uid,
    };
  } else if (providerData.providerId === 'facebook.com') {
    email = providerData.email;
    loginDetail = {
      loginType: LoginTypes.facebook,
      uid: providerData.uid,
    };
  } else {
    throw new AppError('Invalid login provider', 'auth/invalid-login-provider');
  }

  const fullName = firebaseUser.displayName || firebaseUser.email || firebaseUser.phoneNumber || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = {
    _id: firebaseUser.uid,
    fullName,
    avatarUrl: firebaseUser.photoURL,
    phoneNo,
    email,
    loginDetail,
    isActive: true,
    ...addCreationInfo(context),
  };

  const { id } = await repository.create(user);

  return {
    id,
  };
};
