import { OffsetPaginationQuery } from '@app/core';

export interface BookQuery extends OffsetPaginationQuery {
  filter_textSearch?: string;
  category_in?: string[];
}
