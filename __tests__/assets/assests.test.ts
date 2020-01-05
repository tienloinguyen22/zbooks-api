import { imageSources, jsonSources } from '@app/assets';

describe('assets', () => {
  it('imports successfully', async () => {
    expect(imageSources).toBeDefined();
    expect(jsonSources).toBeDefined();
    expect(jsonSources.countries()).toBeDefined();
  });
});

export {};
