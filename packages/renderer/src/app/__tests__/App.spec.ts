import mountApp from '@/app/__fixtures__/mountApp';

describe('App', () => {
  it('should work', () => {
    mountApp();

    expect(true).toBe(true);
  });
});
