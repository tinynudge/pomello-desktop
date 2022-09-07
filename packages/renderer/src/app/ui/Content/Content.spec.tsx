import mountComponent, { screen } from '../__fixtures__/mountComponent';
import Content from './Content';

describe('UI - Content', () => {
  it('should display children content', () => {
    mountComponent(
      <Content>
        <h1>Hello world</h1>
      </Content>
    );

    expect(screen.getByRole('heading', { name: 'Hello world' })).toBeInTheDocument();
  });
});
