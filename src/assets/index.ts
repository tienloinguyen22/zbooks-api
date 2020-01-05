/* eslint-disable global-require */

export const imageSources = {};

export interface Country {
  name: string;
  dialCode: string;
  code: string;
}

export const jsonSources = {
  countries: () => require('./jsons/countries.json') as Country[],
};
/* eslint-enable global-require */
