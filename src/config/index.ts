import merge from 'lodash/fp/merge';
import defaultConfig from './default_config.json';
import overrideConfig from './override_config.json';
import serviceAccount from './service_account.json';

const regexConfig = {
  regex: {
    username: /^[a-z0-9]{5,15}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/,
    email: /^[a-z][a-z0-9_.]{0,40}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/,
    phone: /^[0-9]{8,}$/,
    url: /\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
    isoDate: /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/i,
  },
};

export const config = {
  ...merge(defaultConfig, overrideConfig),
  ...regexConfig,
};

export { serviceAccount };
