/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */

import { DataSource } from 'apollo-datasource';
import { Document, Model } from 'mongoose';
import { Repository, Aggregate, WithoutId, QueryResult, Condition, OffsetPagination } from '../interfaces';
import { buildMongoQuery } from './build_mongo_query';
import { buildMongoConditions } from './build_mongo_conditions';

export class MongoRepository<T extends Aggregate> extends DataSource implements Repository<T> {
  model: Model<Document>;

  constructor(model: Model<Document>) {
    super();
    this.model = model;
  }

  async create(entity: WithoutId<T>): Promise<T> {
    const newRecord = (await this.model.create(entity)) as any;
    return newRecord;
  }

  async update(entity: T): Promise<void> {
    const { id, ...updateOjbect } = entity;
    await this.model.findByIdAndUpdate(id, updateOjbect);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async findById(id: string, fields?: Record<string, 0 | 1>): Promise<T | undefined> {
    let dbQuery = this.model.findById(id);
    if (fields) {
      dbQuery = dbQuery.select(fields);
    }
    return dbQuery.lean();
  }

  async findOne(conditions?: Condition<T>[]): Promise<T | undefined> {
    return buildMongoConditions<T>(this.model, conditions, true).lean();
  }

  async count(conditions?: Condition<T>[]): Promise<number> {
    return buildMongoConditions<T>(this.model, conditions).countDocuments();
  }

  async find(conditions?: Condition<T>[], orderBy?: string, fields?: Record<string, 0 | 1>): Promise<T[]> {
    return buildMongoQuery<T>(this.model, conditions, orderBy, undefined, fields).lean();
  }

  async findWithOffsetPagination(
    pagination: OffsetPagination,
    conditions?: Condition<T>[],
    orderBy?: string,
    fields?: Record<string, 0 | 1>,
  ): Promise<QueryResult<T>> {
    const [data, total] = await Promise.all([
      buildMongoQuery<T>(this.model, conditions, orderBy, pagination, fields).lean(),
      this.count(conditions),
    ]);
    return {
      data,
      pagination: {
        type: 'OFFSET',
        total,
      },
    };
  }
}
