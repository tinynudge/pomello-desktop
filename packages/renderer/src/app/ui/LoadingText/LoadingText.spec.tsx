import LoadingText from '.';
import mountComponent, { screen } from '../__fixtures__/mountComponent';

describe('UI - Loading Text', () => {
  it('should render properly', () => {
    mountComponent(<LoadingText />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });
});
