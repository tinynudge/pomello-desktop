import mountApp from '@/app/__fixtures__/mountApp';
import { screen } from '@testing-library/svelte';

describe('App', () => {
  it('should work', () => {
    mountApp();

    screen.debug();

    expect(true).toBe(true);
  });
});
