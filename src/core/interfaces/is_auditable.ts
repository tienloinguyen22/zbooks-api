import { ISODate } from './iso_date';

/**
 * Interface for auditable objects with creation & modification info
 */
export interface IsAuditable {
  createdBy?: string;
  createdAt?: ISODate;
  lastModifiedBy?: string;
  lastModifiedAt?: ISODate;
}
