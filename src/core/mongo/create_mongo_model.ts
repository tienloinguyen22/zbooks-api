import mongoose, { Schema, Model, Document } from 'mongoose';
import { debug } from '../helpers';

const cleanResult = (result: Document | Document[]): void => {
  if (Array.isArray(result)) {
    result.forEach((doc) => {
      if (!doc) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      doc.id = doc._id.toString();
      // eslint-disable-next-line no-param-reassign
      delete doc._id;
      // eslint-disable-next-line no-param-reassign
      delete doc.__v;
    });
  } else {
    if (!result) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    result.id = result._id;
    // eslint-disable-next-line no-param-reassign
    delete result._id;
    // eslint-disable-next-line no-param-reassign
    delete result.__v;
  }
};

export const createMongoModel = ({ name, schema }: { name: string; schema: Schema }): Model<Document> => {
  ['create', 'find', 'findOne', 'findById', 'findByIdAndUpdate'].forEach((method) => schema.post(method, cleanResult));
  const model = mongoose.model(name, schema);
  if (debug()) {
    model.ensureIndexes();
  }
  return model;
};
