import { MongoRepository, createMongoModel } from '@app/core';
import { Schema } from 'mongoose';
import { User } from '../interfaces';

const model = createMongoModel({
  name: 'users',
  schema: new Schema({
    username: String,
    email: String,
    firstName: String,
    middleName: String,
    lastName: String,
    fullName: String,
    phoneNo: String,
    address: String,
    avatarUrl: String,
    dob: String,
    gender: String,
    loginDetail: Object,
    roles: Array,
    isActive: Boolean,
    lastLoggedInAt: String,
    createdBy: String,
    createdAt: String,
    lastModifiedBy: String,
    lastModifiedAt: String,
    firebaseId: String,
  })
    .index(
      {
        username: 1,
      },
      {
        unique: true,
        partialFilterExpression: {
          username: {
            $type: 'string',
          },
        },
      },
    )
    .index(
      {
        firebaseId: 1,
      },
      {
        unique: true,
        partialFilterExpression: {
          firebaseId: {
            $type: 'string',
          },
        },
      },
    )
    .index({
      fullName: 'text',
      email: 'text',
    })
    .index({
      lastLoggedInAt: -1,
    })
    .index({
      createdAt: -1,
    }),
});

export class UsersRepository extends MongoRepository<User> {
  constructor() {
    super(model);
  }
}
