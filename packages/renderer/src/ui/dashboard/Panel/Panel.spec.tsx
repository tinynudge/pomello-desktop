import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Panel } from './Panel';

describe('UI - Panel', () => {
  it('should render the panel', () => {
    renderDashboardComponent(() => <Panel heading="Head shoulder knees and toes" />);

    expect(screen.getByRole('heading', { name: 'Head shoulder knees and toes', level: 2 })).toBeInTheDocument();
  });

  it('should render a subheading if provided', () => {
    renderDashboardComponent(() => (
      <Panel heading="Head shoulder knees and toes" subHeading="And eyes and ears and mouth and nose" />
    ));

    expect(screen.getByText('And eyes and ears and mouth and nose')).toBeInTheDocument();
  });

  it('should be able to pass a ref to the content element', () => {
    let contentElement: HTMLDivElement | undefined;

    renderDashboardComponent(() => (
      <Panel heading="Head shoulder knees and toes" contentRef={element => (contentElement = element)} />
    ));

    expect(contentElement).toBeInstanceOf(HTMLDivElement);
  });

  it('should be able to pass a custom class to the content element', () => {
    let contentElement: HTMLDivElement | undefined;

    renderDashboardComponent(() => (
      <Panel
        contentClass="my-custom-class"
        contentRef={element => (contentElement = element)}
        heading="Head shoulder knees and toes"
      />
    ));

    expect(contentElement).toHaveClass('my-custom-class');
  });
});
