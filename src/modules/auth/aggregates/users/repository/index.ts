import { MongoRepository, createMongoModel, Genders, LoginTypes } from '@app/core';
import { Schema } from 'mongoose';
import { User } from '../interfaces';

const LoginDetailSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  loginType: {
    type: String,
    enum: [LoginTypes.facebook, LoginTypes.google],
  },
});

const model = createMongoModel({
  name: 'User',
  schema: new Schema({
    firebaseId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    address: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: [Genders.female, Genders.male, Genders.other],
    },
    loginDetail: LoginDetailSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoggedInAt: {
      type: Date,
    },
    preferenceCategories: {
      type: [String],
      default: [],
    },
  })
    .index(
      {
        fullName: 'text',
        email: 'text',
        phoneNo: 'text',
      },
      {
        name: 'usersTextSearch',
      },
    )
    .index({
      firebaseId: 1,
    }),
});

export class UsersRepository extends MongoRepository<User> {
  constructor() {
    super(model);
  }
}
