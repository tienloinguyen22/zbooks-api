import { AppError } from './app_error';

/* eslint-disable @typescript-eslint/no-explicit-any */

type HandlerFunction = (queryOrMutation: any, context: any) => Promise<any>;

type WithErrorHandlerResult = (queryOrMutation: any, context: any) => Promise<any>;

export const withErrorHandler = (handler: HandlerFunction): WithErrorHandlerResult => {
  return async (insideQueryOrMutation: any, insideContext: any) => {
    try {
      return await handler(insideQueryOrMutation, insideContext);
    } catch (err) {
      if (err.name === 'ValidationError') {
        if (err.message.indexOf('must match the following') > -1) {
          err.type = 'REGEX_NOT_MATCHED';
        }
        throw new AppError(err.message, `INVALID_PAYLOAD_${err.type.toUpperCase()}`, {
          field: err.params.path,
        });
      }
      if (err.code) {
        throw new AppError(err.message, err.code);
      } else {
        throw err;
      }
    }
  };
};
