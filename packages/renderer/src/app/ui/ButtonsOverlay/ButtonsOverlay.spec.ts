import html from 'svelte-htm';
import mountComponent, { screen } from '../__fixtures__/mountComponent';
import ButtonsOverlay from './ButtonsOverlay.svelte';

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
