import { renderAppComponent, screen } from '../__fixtures__/renderAppComponent';
import { LoadingText } from './LoadingText';

describe('UI - Loading Text', () => {
  it('should render properly', () => {
    renderAppComponent(() => <LoadingText />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
