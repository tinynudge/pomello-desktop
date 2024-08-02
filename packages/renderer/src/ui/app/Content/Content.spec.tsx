import { renderAppComponent, screen } from '../__fixtures__/renderAppComponent';
import { Content } from './Content';

describe('UI - Content', () => {
  it('should display children content', () => {
    renderAppComponent(() => (
      <Content>
        <h1>Hello world</h1>
      </Content>
    ));

    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
  });
});
