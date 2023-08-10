import ButtonsOverlay from '@/app/ui/ButtonsOverlay.svelte';
import mountComponent, { screen } from '@/app/ui/__fixtures__/mountComponent';
import html from 'svelte-htm';

describe('UI - Buttons Overlay', () => {
  it('should render properly', () => {
    mountComponent(html`
    <${ButtonsOverlay}>
      <h1>My heading</h1>

      <svelte:fragment slot="buttons">
        <button>One</button>
        <button>Two</button>
      </svelte:fragment>
    </${ButtonsOverlay}>
    `);

    expect(screen.getByRole('heading', { name: 'My heading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });
});
