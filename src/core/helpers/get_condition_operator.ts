import { QueryOperators } from '../interfaces';

export const getConditionOperator = (operator: string): string => {
  switch (operator) {
    case QueryOperators.equals:
      return '=';
    case QueryOperators.gt:
      return '>';
    case QueryOperators.gte:
      return '>=';
    case QueryOperators.lt:
      return '<';
    case QueryOperators.lte:
      return '<=';
    case QueryOperators.ne:
      return '!=';
    case QueryOperators.textSearch:
      return 'LIKE';
    default:
      return '=';
  }
};
