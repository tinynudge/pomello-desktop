import { renderComponent, screen } from '../__fixtures__/renderComponent';
import { LoadingText } from './LoadingText';

describe('UI - Loading Text', () => {
  it('should render properly', () => {
    renderComponent(() => <LoadingText />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
