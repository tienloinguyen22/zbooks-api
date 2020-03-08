import { validateSchema, AppError, QueryOperators } from '@app/core';
import * as yup from 'yup';
import admin from 'firebase-admin';
import { FindUserByTokenQuery, User } from '../interfaces';
import { usersRepository } from '../repository';

export const handler = async (query: FindUserByTokenQuery): Promise<User | undefined> => {
  // 1. Validate
  await validateSchema(
    yup.object().shape<FindUserByTokenQuery>({
      token: yup.string().required('auth/missing-token'),
    }),
    query,
  );

  // 2. Decode firebase token to get firebaseId
  let decodeFirebaseTokenInfo: admin.auth.DecodedIdToken | undefined;
  try {
    decodeFirebaseTokenInfo = await admin.auth().verifyIdToken(query.token);
  } catch (err) {
    throw new AppError(err.message, err.code);
  }

  // 3. Query database
  const conditions = [
    {
      field: 'firebaseId',
      operator: QueryOperators.equals,
      value: decodeFirebaseTokenInfo.uid,
    },
  ];
  const user = await usersRepository.findOne(conditions);
  return user;
};
