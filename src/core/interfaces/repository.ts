import { WithoutId, Aggregate } from './aggregate';
import { Condition } from './condition';
import { QueryResult } from './query_result';
import { OffsetPagination } from './offset_pagination';

export type UpdateEntity<T> = { id: string } & Partial<T>;
export interface Repository<T extends Aggregate> {
  create(entity: WithoutId<T>): Promise<{ id: string }>;
  update(entity: { id: string } & Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  count(conditions?: Condition<T>[]): Promise<number>;
  findById(id: string, fields?: Record<string, 0 | 1>): Promise<T | undefined>;
  find(conditions?: Condition<T>[], orderBy?: string, fields?: Record<string, 0 | 1>): Promise<T[]>;
  findWithOffsetPagination(
    pagination: OffsetPagination,
    conditions?: Condition<T>[],
    orderBy?: string,
    fields?: Record<string, 0 | 1>,
  ): Promise<QueryResult<T>>;
}
