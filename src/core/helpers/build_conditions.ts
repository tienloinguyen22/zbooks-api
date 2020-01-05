import { Condition } from '../interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildConditions = <T>(conditionFields: { [field: string]: any }): Condition<T>[] => {
  return Object.keys(conditionFields)
    .filter((key) => key !== 'queryId')
    .map(
      (key) =>
        ({
          field: key.split('_')[0],
          operator: key.split('_')[1],
          value: conditionFields[key],
        } as Condition<T>),
    );
};
