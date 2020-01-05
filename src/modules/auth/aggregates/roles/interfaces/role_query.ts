import { OffsetPaginationQuery } from '@app/core';

export interface RoleQuery extends OffsetPaginationQuery {
  filter_textSearch: string;
}
