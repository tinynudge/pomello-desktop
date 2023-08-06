import html from 'svelte-htm';
import mountComponent, { screen } from '../__fixtures__/mountComponent';
import Content from './Content.svelte';

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
