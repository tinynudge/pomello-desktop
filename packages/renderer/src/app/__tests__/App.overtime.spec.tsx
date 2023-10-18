import mountApp, { screen } from '../__fixtures__/mountApp';

describe('App - Overtime', () => {
  it('should show overtime after the delay', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
        overtimeDelay: 5,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3); // Timer ends
    await simulate.advanceTimer(4); // One second before overtime delay

    expect(screen.queryByTestId('overtime')).not.toBeInTheDocument();

    await simulate.advanceTimer(1);

    expect(screen.getByTestId('overtime')).toHaveTextContent(':05');
  });

  it('should show the overtime in m:ss format', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
        overtimeDelay: 5,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3); // Timer ends
    await simulate.advanceTimer(65); // One minute five seconds

    expect(screen.getByTestId('overtime')).toHaveTextContent('1:05');
  });

  it('should show the overtime in h:m:s format', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
        overtimeDelay: 5,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3); // Timer ends
    await simulate.advanceTimer(60 * 60); // One hour

    expect(screen.getByTestId('overtime')).toHaveTextContent('1:00:00');

    await simulate.advanceTimer(60 * 12 + 23); // 12 minutes 23 seconds

    expect(screen.getByTestId('overtime')).toHaveTextContent('1:12:23');
  });
});
