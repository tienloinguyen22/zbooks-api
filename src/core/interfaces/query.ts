import { GUID } from './guid';

export interface Query {
  queryId: GUID;
  orderBy?: string; // format: fieldname-asc or fieldname-desc
}
