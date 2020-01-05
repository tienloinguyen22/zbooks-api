import * as yup from 'yup';
import {
  CommandResult,
  Context,
  withoutCommandId,
  getFieldExistedErrorMessage,
  WithoutCommandId,
  UpdateEntity,
  validateEntityExisting,
  validateUpdatedSchema,
  addModificationInfo,
  getInvalidDateErrorMessage,
} from '@app/core';
import admin from 'firebase-admin';

import { config } from '@app/config';
import { getFullName } from '../../../helpers/get_full_name';
import { UpdateUserCommand, User, UserRepository } from '../interfaces';

export const handler = async (command: UpdateUserCommand, context: Context): Promise<CommandResult> => {
  const repository = context.dataSources.users as UserRepository;
  const existingUser = await validateEntityExisting(command.id, repository);

  // forbid to update username if already exists
  if (existingUser.username) {
    // eslint-disable-next-line no-param-reassign
    delete command.username;
  }

  // forbid email-type user to update email
  if (existingUser.loginDetail.loginType === 'EMAIL' || existingUser.loginDetail.loginType === 'GOOGLE') {
    // eslint-disable-next-line no-param-reassign
    delete command.email;
  }

  // forbid phoneNo-type user to update phoneNo
  if (existingUser.loginDetail.loginType === 'PHONE_NO') {
    // eslint-disable-next-line no-param-reassign
    delete command.phoneNo;
  }

  await validateUpdatedSchema(
    yup.object().shape<WithoutCommandId<UpdateUserCommand>>({
      id: yup.string().required(),
      username: yup
        .string()
        .required()
        .matches(config.regex.username)
        .test('UNIQUE_USERNAME', getFieldExistedErrorMessage('username'), async (value: string) => {
          const existedCount = await repository.count([
            {
              field: 'id',
              operator: 'ne',
              value: command.id,
            },
            {
              field: 'username',
              operator: 'equals',
              value,
            },
          ]);
          return existedCount === 0;
        }),
      email: yup
        .string()
        .required()
        .matches(config.regex.email)
        .test('UNIQUE', getFieldExistedErrorMessage('email'), async (value: string) => {
          const existedCount = await repository.count([
            {
              field: 'id',
              operator: 'ne',
              value: command.id,
            },
            {
              field: 'email',
              operator: 'equals',
              value,
            },
          ]);
          return existedCount === 0;
        }),
      password: yup
        .string()
        .required()
        .matches(config.regex.password),
      firstName: yup
        .string()
        .required()
        .max(config.validation.string.maxLength),
      middleName: yup.string().max(config.validation.string.maxLength),
      lastName: yup
        .string()
        .required()
        .max(config.validation.string.maxLength),
      phoneNo: yup.string().max(config.validation.string.maxLength),
      address: yup.string().max(config.validation.string.maxLength),
      avatarUrl: yup.string(),
      dob: yup.string().test('DOB', getInvalidDateErrorMessage(), (value: string) => {
        return value.length === 0 || value.length === config.validation.date.length;
      }),
      gender: yup.string(),
      roles: yup.array(),
      isActive: yup.boolean(),
    }),
    command,
  );

  const user: UpdateEntity<User> = {
    ...withoutCommandId(command),
    ...addModificationInfo(context),
  };

  if (user.firstName || user.middleName || user.lastName) {
    if (existingUser) {
      user.displayName = getFullName({
        firstName: user.firstName || existingUser.firstName,
        middleName: user.middleName || existingUser.middleName,
        lastName: user.lastName || existingUser.lastName,
      });
    }
  }

  // update firebase user
  const updatedFirebaseUser: admin.auth.UpdateRequest = {};
  let shouldUpdateFirebase = false;
  if (user.isActive === true || user.isActive === false) {
    updatedFirebaseUser.disabled = !user.isActive;
    shouldUpdateFirebase = true;
  }
  if (user.displayName) {
    updatedFirebaseUser.displayName = user.displayName;
    shouldUpdateFirebase = true;
  }
  if (command.email) {
    updatedFirebaseUser.email = command.email;
    shouldUpdateFirebase = true;
  }
  if (command.password) {
    updatedFirebaseUser.password = command.password;
    shouldUpdateFirebase = true;
  }
  if (command.phoneNo) {
    updatedFirebaseUser.phoneNumber = user.phoneNo;
    shouldUpdateFirebase = true;
  }
  if (command.avatarUrl) {
    updatedFirebaseUser.photoURL = command.avatarUrl;
    shouldUpdateFirebase = true;
  }
  if (shouldUpdateFirebase) {
    await admin.auth().updateUser(existingUser.firebaseId, updatedFirebaseUser);
  }

  await repository.update(user);

  return {
    id: command.id,
  };
};
