import { Lookup } from '../interfaces';

export type Gender = Lookup;
export const GENDERS: readonly Gender[] = [
  {
    value: 'MALE',
    label: 'Male',
  },
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'OTHER',
    label: 'Other',
  },
] as const;
