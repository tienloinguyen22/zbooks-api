export interface Condition<T> {
  field: keyof T;
  operator: 'textSearch' | 'equals' | 'ne' | 'gte' | 'lte' | 'gt' | 'lt';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
