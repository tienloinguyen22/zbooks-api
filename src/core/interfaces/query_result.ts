import { OffsetPaginationResult } from './offset_pagination_result';
import { CursorPaginationResult } from './cursor_pagination_result';

export enum PaginationTypes {
  OFFSET = 'OFFSET',
  CURSOR = 'CURSOR',
}

export interface QueryResult<T> {
  data: T[];
  pagination: OffsetPaginationResult | CursorPaginationResult;
}
