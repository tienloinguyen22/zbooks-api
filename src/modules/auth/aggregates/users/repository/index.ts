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
    _id: {
      type: String,
      required: true,
      unique: true,
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
    lineNumber: {
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
  }).index(
    {
      fullName: 'text',
      email: 'text',
      phoneNo: 'text',
    },
    {
      name: 'usersTextSearch',
    },
  ),
});

export class UsersRepository extends MongoRepository<User> {
  constructor() {
    super(model);
  }
}
