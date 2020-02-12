import { DocumentQuery, Model, Document } from 'mongoose';
import { config } from '@app/config';
import { AppError } from '../helpers/app_error';
import { Condition, OffsetPagination } from '../interfaces';
import { buildMongoConditions } from './build_mongo_conditions';

export const buildMongoQuery = <T>(
  model: Model<Document>,
  conditions?: Condition<T>[],
  orderBy?: string,
  pagination?: OffsetPagination,
  fields?: Record<string, 0 | 1>,
): DocumentQuery<Document[], Document> => {
  let dbQuery = buildMongoConditions<T>(model, conditions);

  if (orderBy) {
    const orderByFields = orderBy.split(';');
    orderByFields.forEach((orderByField) => {
      const [field, sort] = orderByField.split('_');
      dbQuery = dbQuery.sort({
        [field]: sort === 'desc' ? -1 : 1,
      });
    });
  }

  if (pagination && pagination.type === 'OFFSET') {
    const pageIndex = pagination.pageIndex || 0;
    const itemsPerPage = pagination.itemsPerPage || config.itemsPerPage.default;

    if (itemsPerPage > config.itemsPerPage.max) {
      throw new AppError(`Invalid items per page. Maximum value: ${config.itemsPerPage.max}`, 'INVALID_ITEMS_PER_PAGE');
    }

    dbQuery = dbQuery.skip(pageIndex * itemsPerPage).limit(itemsPerPage);
  }

  if (fields) {
    dbQuery = dbQuery.select(fields);
  }

  return dbQuery;
};
