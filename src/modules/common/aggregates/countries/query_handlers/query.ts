import countries from '@app/assets/jsons/countries.json';
import { Country } from '../interfaces/country';

export const handler = async (): Promise<Country[]> => countries;
