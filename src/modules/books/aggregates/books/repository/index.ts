import { MongoRepository, createMongoModel } from '@app/core';
import { Schema } from 'mongoose';
import { Book } from '../interfaces';

const model = createMongoModel({
  name: 'Book',
  schema: new Schema({
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    category: [String],
    year: {
      type: String,
    },
    publisher: {
      type: String,
    },
    language: {
      type: String,
    },
    pages: {
      type: Number,
    },
    fileInfo: {
      type: String,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    referer: {
      type: String,
    },
    coverUrl: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  }).index(
    {
      title: 'text',
    },
    {
      name: 'booksTextSearch',
    },
  ),
});

export class BooksRepository extends MongoRepository<Book> {
  constructor() {
    super(model);
  }
}
