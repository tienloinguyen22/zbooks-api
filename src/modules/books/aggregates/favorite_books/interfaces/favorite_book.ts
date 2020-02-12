import { Aggregate, IsAuditable } from '@app/core';

export interface FavoriteBook extends Aggregate, IsAuditable {
  user: string; // Reference 'User' table
  book: string; // Reference 'Book' table
}
