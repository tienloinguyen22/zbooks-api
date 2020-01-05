import * as yup from 'yup';
import admin from 'firebase-admin';
import {
  CommandResult,
  Context,
  validateSchema,
  WithoutId,
  withoutCommandId,
  getFieldExistedErrorMessage,
  WithoutCommandId,
  addCreationInfo,
} from '@app/core';
import { config } from '@app/config';
import { CreateUserCommand, User, UserRepository } from '../interfaces';
import { getFullName } from '../../../helpers/get_full_name';

export const handler = async (command: CreateUserCommand, context: Context): Promise<CommandResult> => {
  const repository = context.dataSources.users as UserRepository;

  await validateSchema(
    yup.object().shape<WithoutCommandId<CreateUserCommand>>({
      username: yup
        .string()
        .required()
        .matches(config.regex.username)
        .test('UNIQUE', getFieldExistedErrorMessage('username'), async (value: string) => {
          const existedCount = await repository.count([
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
      dob: yup.string().length(config.validation.date.length),
      gender: yup.string(),
      roles: yup.array(),
      isActive: yup.boolean(),
    }),
    command,
  );

  const user: WithoutId<User> = {
    ...withoutCommandId(command),
    displayName: getFullName(command),
    loginDetail: {
      loginType: 'EMAIL',
      email: command.email,
    },
    roles: command.roles || [],
    firebaseId: '',
    ...addCreationInfo(context),
  };

  const firebaseUser = await admin.auth().createUser({
    email: command.email,
    emailVerified: true,
    phoneNumber: command.phoneNo || undefined,
    password: command.password,
    displayName: user.displayName,
    photoURL: undefined,
    disabled: !command.isActive,
  });
  user.firebaseId = firebaseUser.uid;

  const { id } = await repository.create(user);
  admin.auth().setCustomUserClaims(firebaseUser.uid, {
    id,
    roles: [],
  });
  return {
    id,
  };
};
