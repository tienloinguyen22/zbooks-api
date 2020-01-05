import { Query } from './query';

export interface OffsetPaginationQuery extends Query {
  pageIndex?: number;
  itemsPerPage?: number;
}
