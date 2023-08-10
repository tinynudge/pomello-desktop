import LoadingText from '@/app/ui/LoadingText.svelte';
import mountComponent, { screen } from '@/app/ui/__fixtures__/mountComponent';
import html from 'svelte-htm';

describe('UI - Loading Text', () => {
  it('should render properly', () => {
    mountComponent(html`<${LoadingText} />`);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
