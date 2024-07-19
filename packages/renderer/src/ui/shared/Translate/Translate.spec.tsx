import { ParentComponent } from 'solid-js';
import { renderComponent, screen } from '../../__fixtures__/renderComponent';
import { Translate } from './Translate';

describe('UI - Translate', () => {
  it('should render the interpolated translations', () => {
    const translations = {
      soundsOfSilence:
        'Hello <one first="yes or no" second=\'no\'>darkness</one> my <two>old friend</two>.',
    };

    const One: ParentComponent<{ first: string; second: string }> = props => (
      <h1 data-first={props.first} data-second={props.second}>
        {props.children}
      </h1>
    );

    const Two: ParentComponent = props => <button>{props.children}</button>;

    renderComponent(
      () => (
        <div data-testid="container">
          <Translate
            key="soundsOfSilence"
            components={{
              one: One,
              two: Two,
            }}
          />
        </div>
      ),
      { translations }
    );

    expect(screen.getByTestId('container')).toHaveTextContent('Hello darkness my old friend');
    expect(screen.getByRole('button', { name: 'old friend' })).toBeInTheDocument();

    const heading = screen.getByRole('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('data-first', 'yes or no');
    expect(heading).toHaveAttribute('data-second', 'no');
  });
});
