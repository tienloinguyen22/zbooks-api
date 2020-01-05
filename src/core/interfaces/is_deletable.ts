import { TimestampInMilliseconds } from './timestamp_in_milliseconds';

/**
 * Interface for deletable objects with deletion info
 */
export interface IsDeletable {
  deletedBy?: string;
  deletedAt?: TimestampInMilliseconds;
  isDeleted: boolean;
}
