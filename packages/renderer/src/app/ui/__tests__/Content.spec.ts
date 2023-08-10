import Content from '@/app/ui/Content.svelte';
import mountComponent, { screen } from '@/app/ui/__fixtures__/mountComponent';
import html from 'svelte-htm';

describe('UI - Content', () => {
  it('should display children content', () => {
    mountComponent(html`
      <${Content}>
        <h1>Hello world</h1>
      </${Content}>
    `);

    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
  });
});
