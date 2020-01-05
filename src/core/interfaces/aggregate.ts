/**
 * Interface for aggregate
 */
export interface Aggregate {
  id: string;
}

export type WithoutId<T> = Omit<T, 'id'>;
