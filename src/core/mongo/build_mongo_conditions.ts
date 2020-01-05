import { DocumentQuery, Model, Document } from 'mongoose';
import { Condition } from '../interfaces';

export const buildMongoConditions = <T>(
  model: Model<Document>,
  conditions?: Condition<T>[],
): DocumentQuery<Document[], Document> => {
  let dbQuery = model.find();

  if (conditions) {
    conditions.forEach((condition) => {
      if (condition.operator === 'textSearch' && condition.value) {
        dbQuery = dbQuery.find({
          $text: {
            $search: condition.value,
          },
        });
      } else {
        const field = condition.field === 'id' ? '_id' : condition.field;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbQuery = (dbQuery.where(field) as any)[condition.operator](condition.value);
      }
    });
  }

  return dbQuery;
};
