import _ from 'lodash';
import { Genders } from '@app/core';

export const handler = async (): Promise<{ [key: string]: string }[]> => {
  const genders = [
    {
      label: _.capitalize(Genders.female),
      value: Genders.female,
    },
    {
      label: _.capitalize(Genders.male),
      value: Genders.male,
    },
    {
      label: _.capitalize(Genders.other),
      value: Genders.other,
    },
  ];
  return genders;
};
