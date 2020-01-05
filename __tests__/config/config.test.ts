import { config } from '@app/config';

describe('assets', () => {
  it('imports successfully', async () => {
    expect(config).toBeDefined();
  });
});

export {};
