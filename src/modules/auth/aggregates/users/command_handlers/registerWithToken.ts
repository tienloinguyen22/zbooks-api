import * as yup from 'yup';
import admin from 'firebase-admin';
import {
  CommandResult,
  Context,
  validateSchema,
  WithoutId,
  WithoutCommandId,
  AppError,
  addCreationInfo,
} from '@app/core';
import { User, UserRepository, RegisterWithTokenCommand, ExternalLogin } from '../interfaces';

export const handler = async (command: RegisterWithTokenCommand, context: Context): Promise<CommandResult> => {
  const repository = context.dataSources.users as UserRepository;

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
      loginType: 'GOOGLE',
      email: providerData.email,
      uid: providerData.uid,
    };
  } else if (providerData.providerId === 'facebook.com') {
    email = providerData.email;
    loginDetail = {
      loginType: 'FACEBOOK',
      email: providerData.email,
      uid: providerData.uid,
    };
  } else if (providerData.providerId === 'phone') {
    loginDetail = {
      loginType: 'PHONE_NO',
      phoneNo: providerData.phoneNumber,
    };
    phoneNo = providerData.phoneNumber;
  } else {
    email = providerData.email;
    loginDetail = {
      loginType: 'EMAIL',
      email: providerData.email,
    };
  }
  const displayName = firebaseUser.displayName || firebaseUser.email || firebaseUser.phoneNumber || '';
  const firstName = displayName.split(' ')[0];
  const lastName = displayName
    .split(' ')
    .filter((_name, index) => index > 0)
    .join(' ');

  const user: WithoutId<User> = {
    firstName,
    lastName,
    displayName,
    avatarUrl: firebaseUser.photoURL,
    phoneNo,
    email,
    loginDetail,
    roles: [],
    isActive: true,
    firebaseId: firebaseUser.uid,
    ...addCreationInfo(context),
  };

  const { id } = await repository.create(user);
  admin.auth().setCustomUserClaims(firebaseUser.uid, {
    id,
    roles: [],
  });
  return {
    id,
  };
};
