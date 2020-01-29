import { validateAuthenticate, Context, MutationResult, validateSchema, Genders, addModificationInfo } from '@app/core';
import * as yup from 'yup';
import { config } from '@app/config';
import _ from 'lodash';
import { User, UserRepository, UpdateUserInfoPayload } from '../interfaces';

export const handler = async (payload: UpdateUserInfoPayload, context: Context): Promise<MutationResult<User>> => {
  const repository: UserRepository = context.dataSources.users;

  // 1. Authenticate
  validateAuthenticate(context.user);

  // 2. Validate
  await validateSchema(
    yup.object().shape<UpdateUserInfoPayload>({
      email: yup
        .string()
        .nullable(true)
        .matches(config.regex.email, 'auth/invalid-email'),
      fullName: yup.string().nullable(true),
      countryCode: yup.string().test('Valid country code', 'auth/invalid-country-code', (value: string) => {
        if (!value) {
          return true;
        }
        return _.get(payload, 'phoneNo', '').includes(value);
      }),
      phoneNo: yup
        .string()
        .nullable(true)
        .matches(config.regex.phone, 'auth/invalid-phone-number'),
      address: yup.string().nullable(true),
      avatarUrl: yup
        .string()
        .nullable(true)
        .matches(config.uploads.allowedImageExt, 'auth/invalid-avatar-url'),
      dob: yup
        .string()
        .nullable(true)
        .matches(config.regex.isoDate, 'auth/invalid-dob'),
      gender: yup
        .string()
        .nullable(true)
        .oneOf([Genders.female, Genders.male, Genders.other], 'auth/invalid-gender'),
      preferenceCategories: yup.array().of(yup.string()),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
    payload,
  );

  // 3. Update db
  const updatePayload = {
    id: _.get(context, 'user.id'),
    ...payload,
    ...addModificationInfo(context),
  };
  const newProfileInfo = await repository.update(updatePayload);
  return newProfileInfo;
};
