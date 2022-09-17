import { vi } from 'vitest';
import mountApp, { screen } from '../__fixtures__/mountApp';

describe('App - Overtime', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should show overtime after the delay', async () => {
    const { simulate } = mountApp({
      settings: {
        taskTime: 3,
        overtimeDelay: 5,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3000); // Timer ends
    await simulate.advanceTimer(4000); // One second before overtime delay

    expect(screen.queryByTestId('overtime')).not.toBeInTheDocument();

    await simulate.advanceTimer(1000);

    expect(screen.getByTestId('overtime')).toHaveTextContent(':05');
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
    await simulate.advanceTimer(3000); // Timer ends
    await simulate.advanceTimer(1000 * 65); // One minute five seconds

    expect(screen.getByTestId('overtime')).toHaveTextContent('1:05');

    await simulate.advanceTimer(1000 * 60 * 60 + 10000); // One hour ten seconds

    expect(screen.getByTestId('overtime')).toHaveTextContent('1:01:15');
  });
});
