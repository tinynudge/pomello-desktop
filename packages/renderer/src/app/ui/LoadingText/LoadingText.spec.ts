import html from 'svelte-htm';
import mountComponent, { screen } from '../__fixtures__/mountComponent';
import LoadingText from './LoadingText.svelte';

describe('UI - Loading Text', () => {
  it('should render properly', () => {
    mountComponent(html`<${LoadingText} />`);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
