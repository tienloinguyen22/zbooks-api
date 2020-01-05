import { OffsetPaginationResult } from './offset_pagination_result';
import { CursorPaginationResult } from './cursor_pagination_result';

export interface QueryResult<T> {
  data: T[];
  pagination: OffsetPaginationResult | CursorPaginationResult;
}
