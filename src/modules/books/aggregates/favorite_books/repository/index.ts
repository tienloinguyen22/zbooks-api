import { MongoRepository, createMongoModel } from '@app/core';
import { Schema } from 'mongoose';
import { FavoriteBook } from '../interfaces';

const model = createMongoModel({
  name: 'FavoriteBook',
  schema: new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  }).index({
    user: 1,
    book: 1,
  }),
});

export class FavoriteBooksRepository extends MongoRepository<FavoriteBook> {
  constructor() {
    super(model);
  }
}
