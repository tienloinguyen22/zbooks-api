export enum MongoQueryOperators {
  textSearch = 'textSearch',
  equals = 'equals',
  ne = 'ne',
  gte = 'gte',
  lte = 'lte',
  gt = 'gt',
  lt = 'lt',
}

export interface Condition<T> {
  field: string;
  operator: MongoQueryOperators;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
