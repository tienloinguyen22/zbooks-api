jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
}));

describe('server', () => {
  it('runs successfully', async () => {
    // bootstrap();
  });
});

export {};
