import { renderComponent, screen } from '../../__fixtures__/renderComponent';
import { Content } from './Content';

describe('UI - Content', () => {
  it('should display children content', () => {
    renderComponent(() => (
      <Content>
        <h1>Hello world</h1>
      </Content>
    ));

    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
  });
});
