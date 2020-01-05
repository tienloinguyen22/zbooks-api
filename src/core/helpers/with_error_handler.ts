import { AppError } from './app_error';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const withErrorHandler = (
  handler: (queryOrCommand: any, context: any) => Promise<any>,
): ((queryOrCommand: any, context: any) => Promise<any>) => {
  return async (insideQueryOrCommand: any, insideContext: any) => {
    try {
      return await handler(insideQueryOrCommand, insideContext);
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
        const code = err.code.replace(/[/,-]/g, '_').toUpperCase();
        throw new AppError(err.message, code);
      } else {
        throw err;
      }
    }
  };
};
