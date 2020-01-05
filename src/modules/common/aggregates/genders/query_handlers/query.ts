import { GENDERS } from '@app/core';

export const handler = async (): Promise<typeof GENDERS> => {
  return GENDERS;
};
