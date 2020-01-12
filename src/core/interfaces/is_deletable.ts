import { ISODate } from './iso_date';

/**
 * Interface for deletable objects with deletion info
 */
export interface IsDeletable {
  deletedBy?: string;
  deletedAt?: ISODate;
  isDeleted: boolean;
}
