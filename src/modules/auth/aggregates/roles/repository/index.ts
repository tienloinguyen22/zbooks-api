import { MongoRepository, createMongoModel } from '@app/core';
import { Schema } from 'mongoose';
import { Role } from '../interfaces';

const model = createMongoModel({
  name: 'roles',
  schema: new Schema({
    name: {
      type: String,
      unique: true,
    },
    description: String,
    permissions: Array,
    createdBy: String,
    createdAt: String,
    lastModifiedBy: String,
    lastModifiedAt: String,
  })
    .index({
      name: 'text',
      description: 'text',
    })
    .index({
      createdAt: -1,
    })
    .index({
      lastModifiedAt: -1,
    }),
});

export class RolesRepository extends MongoRepository<Role> {
  constructor() {
    super(model);
  }
}
