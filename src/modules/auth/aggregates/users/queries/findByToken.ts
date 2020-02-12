import { Context, validateSchema, AppError, MongoQueryOperators } from '@app/core';
import * as yup from 'yup';
import admin from 'firebase-admin';
import { FindUserByTokenQuery, User, UserRepository } from '../interfaces';

export const handler = async (query: FindUserByTokenQuery, context: Context): Promise<User | undefined> => {
  const repository: UserRepository = context.dataSources.users;

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
      operator: MongoQueryOperators.equals,
      value: decodeFirebaseTokenInfo.uid,
    },
  ];
  const user = await repository.findOne(conditions);
  return user;
};
