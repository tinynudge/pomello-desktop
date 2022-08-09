import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Dial', () => {
  it('should start the timer when the dial is clicked', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 14 * 60,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show actions' })).toBeInTheDocument();
  });

  it('should start the timer via hotkey', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 25 * 60,
      },
    });

    await simulate.selectTask();
    await simulate.hotkey('startTimer');

    waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show actions' })).toBeInTheDocument();
    });
  });

  it('should show the seconds remaining on the dial when less than a minute remains', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 30,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('should show the leading 0 if the time is less than a minute', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 4,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();

    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('should show/hide actions when an active dial is clicked', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();

    expect(screen.getByRole('button', { name: 'Pause timer' })).toBeInTheDocument();

    await simulate.hideDialActions();

    expect(screen.queryByRole('button', { name: 'Pause timer' })).not.toBeInTheDocument();
  });

  it('should hide the actions when the overlay is clicked', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();

    expect(screen.getByRole('button', { name: 'Hide actions' })).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('dial-overlay'));

    expect(screen.queryByRole('button', { name: 'Hide actions' })).not.toBeInTheDocument();
  });
});
