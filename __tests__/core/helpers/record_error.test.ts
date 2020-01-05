import { recordError } from '@app/core';

describe('core/helpers/record_error', () => {
  it('captures error in production', async () => {
    process.env.NODE_ENV = 'production';
    const error = new Error();
    recordError(error);
  });

  it('writes to console in debug mode', async () => {
    process.env.NODE_ENV = 'development';
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
    const error = new Error();
    recordError(error);

    // expect(Sentry.captureException).not.toBeCalledWith();
    expect(global.console.log).toBeCalledWith(error);
  });
});

export {};
