import { TimestampInMilliseconds } from './timestamp_in_milliseconds';

/**
 * Interface for auditable objects with creation & modification info
 */
export interface IsAuditable {
  createdBy?: string;
  createdAt?: TimestampInMilliseconds;
  lastModifiedBy?: string;
  lastModifiedAt?: TimestampInMilliseconds;
}
