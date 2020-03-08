import { Aggregate } from './aggregate';
import { Condition } from './condition';
import { QueryResult } from './query_result';
import { OffsetPagination } from './offset_pagination';

export type UpdateEntity<T> = { id: string } & Partial<T>;
export interface Repository<T extends Aggregate> {
  createTable(): Promise<void>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete?(id: string): Promise<void>;
  count?(conditions?: Condition<T>[]): Promise<number>;
  findById(id: string, fields?: Record<string, 0 | 1>): Promise<T | undefined>;
  findOne(conditions?: Condition<T>[]): Promise<T | undefined>;
  find?(conditions?: Condition<T>[], orderBy?: string, fields?: Record<string, 0 | 1>): Promise<T[]>;
  findWithOffsetPagination(
    pagination: OffsetPagination,
    conditions?: Condition<T>[],
    orderBy?: string,
    fields?: Record<string, 0 | 1>,
  ): Promise<QueryResult<T>>;
}
