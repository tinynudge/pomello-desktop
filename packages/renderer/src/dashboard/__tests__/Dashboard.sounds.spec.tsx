import { DashboardRoute } from '@pomello-desktop/domain';
import { Howl } from 'howler';
import { nanoid } from 'nanoid';
import { fireEvent, renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

vi.mock('howler', () => {
  const Howl = vi.fn(() => ({
    on: vi.fn(),
    play: vi.fn(),
  }));

  return { Howl };
});

vi.mock('nanoid', async importOriginal => {
  const original = await importOriginal<{ nanoid: typeof nanoid }>();

  return {
    ...original,
    nanoid: vi.fn(original.nanoid),
  };
});

describe('Dashboard - Sounds', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render the sounds', () => {
    renderDashboard({ route: DashboardRoute.Sounds });

    expect(screen.getByRole('heading', { name: 'Sounds', level: 1 })).toBeInTheDocument();

    const taskTimerList = screen.getByRole('list', { name: 'Task timer sounds' });

    expect(taskTimerList).toBeInTheDocument();
    expect(
      within(taskTimerList).getByRole('listitem', { name: 'Start sound' })
    ).toBeInTheDocument();
    expect(within(taskTimerList).getByRole('listitem', { name: 'Tick sound' })).toBeInTheDocument();
    expect(within(taskTimerList).getByRole('listitem', { name: 'End sound' })).toBeInTheDocument();

    const shortBreakTimerList = screen.getByRole('list', { name: 'Short break timer sounds' });

    expect(shortBreakTimerList).toBeInTheDocument();
    expect(
      within(shortBreakTimerList).getByRole('listitem', { name: 'Start sound' })
    ).toBeInTheDocument();
    expect(
      within(shortBreakTimerList).getByRole('listitem', { name: 'Tick sound' })
    ).toBeInTheDocument();
    expect(
      within(shortBreakTimerList).getByRole('listitem', { name: 'End sound' })
    ).toBeInTheDocument();

    const longBreakTimerList = screen.getByRole('list', { name: 'Long break timer sounds' });

    expect(longBreakTimerList).toBeInTheDocument();
    expect(
      within(longBreakTimerList).getByRole('listitem', { name: 'Start sound' })
    ).toBeInTheDocument();
    expect(
      within(longBreakTimerList).getByRole('listitem', { name: 'Tick sound' })
    ).toBeInTheDocument();
    expect(
      within(longBreakTimerList).getByRole('listitem', { name: 'End sound' })
    ).toBeInTheDocument();
  });

  it.each([
    'Task timer start',
    'Task timer tick',
    'Task timer end',
    'Short break timer start',
    'Short break timer tick',
    'Short break timer end',
    'Long break timer start',
    'Long break timer tick',
    'Long break timer end',
  ])('should contain the sound options and the volume slider for "%s"', async name => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          gong1234: {
            name: 'Gong',
            path: 'path/to/gong.mp3',
          },
        },
      },
    });

    const select = screen.getByRole('combobox', { name: `${name} sound` });

    await userEvent.click(select);

    const options = within(select).getAllByRole('option');

    expect(options).toHaveLength(4);
    expect(options.at(0)).toHaveTextContent('Wind up');
    expect(options.at(1)).toHaveTextContent('Egg timer');
    expect(options.at(2)).toHaveTextContent('Ding');
    expect(options.at(3)).toHaveTextContent('Gong');

    expect(within(select).getByRole('group', { name: 'Custom sounds' })).toBeInTheDocument();

    expect(screen.getByRole('slider', { name: `${name} volume` }));
  });

  it('should update a sound', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        taskTimerTickSound: 'egg-timer',
      },
    });

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Task timer tick sound' }),
      'Ding'
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(screen.getByRole('combobox', { name: 'Task timer tick sound' })).toHaveDisplayValue(
      'Egg timer'
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Task timer tick sound' }),
      'Wind up'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({ taskTimerTickSound: 'wind-up' });
  });

  it('should update the volume', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        shortBreakTimerEndVol: 0.8,
      },
    });

    fireEvent.input(screen.getByRole('slider', { name: 'Short break timer end volume' }), {
      target: {
        value: '0.2',
      },
    });

    expect(screen.getByRole('slider', { name: 'Short break timer end volume' })).toHaveValue('0.2');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(screen.getByRole('slider', { name: 'Short break timer end volume' })).toHaveValue('0.8');

    fireEvent.input(screen.getByRole('slider', { name: 'Short break timer end volume' }), {
      target: {
        value: '.2',
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({ shortBreakTimerEndVol: 0.2 });
  });

  it('should restore the default sound', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        longBreakTimerTickSound: 'ding',
        longBreakTimerTickVol: 0.5,
      },
    });

    const longBreakList = screen.getByRole('list', { name: 'Long break timer sounds' });
    const tickItem = within(longBreakList).getByRole('listitem', { name: 'Tick sound' });

    await userEvent.click(within(tickItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Restore default: Egg timer' }));

    expect(
      screen.getByRole('combobox', { name: 'Long break timer tick sound' })
    ).toHaveDisplayValue('Egg timer');
    expect(screen.getByRole('slider', { name: 'Long break timer tick volume' })).toHaveValue('1');

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      longBreakTimerTickSound: 'egg-timer',
      longBreakTimerTickVol: 1,
    });
  });

  it('should preview a selected default sound', async () => {
    const MockHowl = vi.mocked(Howl);

    const { userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        shortBreakTimerTickSound: 'egg-timer',
        shortBreakTimerTickVol: 0.5,
      },
    });

    const shortBreakList = screen.getByRole('list', { name: 'Short break timer sounds' });
    const tickItem = within(shortBreakList).getByRole('listitem', { name: 'Tick sound' });

    await userEvent.click(within(tickItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(within(tickItem).getByRole('menuitem', { name: 'Preview sound' }));

    expect(MockHowl).toHaveBeenCalledWith({
      src: 'audio://sounds/egg-timer.mp3',
      volume: 0.5,
    });

    expect(MockHowl.mock.results[0].value.play).toHaveBeenCalled();
  });

  it('should preview a selected custom sound', async () => {
    const MockHowl = vi.mocked(Howl);

    const { userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        taskTimerTickSound: 'custom-sound',
        taskTimerTickVol: 0.8,
        sounds: {
          'custom-sound': {
            name: 'My custom sound',
            path: 'path/to/custom/sound.mp3',
          },
        },
      },
    });

    const taskList = screen.getByRole('list', { name: 'Task timer sounds' });
    const tickItem = within(taskList).getByRole('listitem', { name: 'Tick sound' });

    await userEvent.click(within(tickItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(within(tickItem).getByRole('menuitem', { name: 'Preview sound' }));

    expect(MockHowl).toHaveBeenCalledWith({
      src: 'audio://path/to/custom/sound.mp3',
      volume: 0.8,
    });

    expect(MockHowl.mock.results[0].value.play).toHaveBeenCalled();
  });

  it('should render the custom sounds section', () => {
    renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          foo: {
            name: 'Foo',
            path: '/fake/path/foo.mp3',
          },
        },
      },
    });

    const customSoundsList = screen.getByRole('list', { name: 'Custom sounds' });
    const customSoundItem = within(customSoundsList).getByRole('listitem', {
      name: 'Custom sound: Foo',
    });

    expect(within(customSoundItem).getByLabelText('Name')).toHaveValue('Foo');
    expect(within(customSoundItem).getByRole('textbox', { name: 'Path' })).toHaveValue(
      '/fake/path/foo.mp3'
    );
  });

  it('should preview a custom sound', async () => {
    const MockHowl = vi.mocked(Howl);

    const { userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          'custom-sound': {
            name: 'My custom sound',
            path: 'path/to/custom/sound.mp3',
          },
        },
      },
    });

    const customSoundItem = screen.getByRole('listitem', { name: 'Custom sound: My custom sound' });

    await userEvent.click(
      within(customSoundItem).getByRole('button', { name: 'Show more options' })
    );
    await userEvent.click(within(customSoundItem).getByRole('menuitem', { name: 'Preview sound' }));

    expect(MockHowl).toHaveBeenCalledWith({
      src: 'audio://path/to/custom/sound.mp3',
      volume: 1,
    });

    expect(MockHowl.mock.results[0].value.play).toHaveBeenCalled();
  });

  it('should update a custom sound name', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          foo: {
            name: 'Foo',
            path: '/fake/path/foo.mp3',
          },
        },
      },
    });

    const customSoundItem = screen.getByRole('listitem', { name: 'Custom sound: Foo' });

    await userEvent.type(within(customSoundItem).getByLabelText('Name'), 'Bar');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(within(customSoundItem).getByLabelText('Name')).toHaveValue('Foo');

    await userEvent.type(within(customSoundItem).getByLabelText('Name'), 'Bar');

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      sounds: {
        foo: {
          name: 'FooBar',
          path: '/fake/path/foo.mp3',
        },
      },
    });
  });

  it('should update a custom sound path', async () => {
    const newSound = new File([], 'johnny-be-good.mp3', { type: 'audio/mp3' });

    const { appApi, userEvent } = renderDashboard({
      appApi: {
        getFilePath: () => '/johnny-be-good.mp3',
      },
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          foo: {
            name: 'Foo',
            path: '/fake/path/foo.mp3',
          },
        },
      },
    });

    const customSoundItem = screen.getByRole('listitem', { name: 'Custom sound: Foo' });

    await userEvent.upload(within(customSoundItem).getByLabelText('Path'), newSound);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(within(customSoundItem).getByRole('textbox', { name: 'Path' })).toHaveValue(
      '/fake/path/foo.mp3'
    );

    await userEvent.upload(within(customSoundItem).getByLabelText('Path'), newSound);

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      sounds: {
        foo: {
          name: 'Foo',
          path: '/johnny-be-good.mp3',
        },
      },
    });
  });

  it('should delete a custom sound', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          foo: {
            name: 'Foo',
            path: '/fake/path/foo.mp3',
          },
        },
      },
    });

    let customSoundItem = screen.getByRole('listitem', { name: 'Custom sound: Foo' });

    await userEvent.click(
      within(customSoundItem).getByRole('button', { name: 'Show more options' })
    );
    await userEvent.click(within(customSoundItem).getByRole('menuitem', { name: 'Delete sound' }));

    expect(screen.queryByRole('listitem', { name: 'Custom sound: Foo' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    customSoundItem = screen.getByRole('listitem', { name: 'Custom sound: Foo' });

    await userEvent.click(
      within(customSoundItem).getByRole('button', { name: 'Show more options' })
    );
    await userEvent.click(within(customSoundItem).getByRole('menuitem', { name: 'Delete sound' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      sounds: {},
    });
  });

  it('should add a custom sound', async () => {
    const newSound = new File([], 'moo.mp3', { type: 'audio/mp3' });

    const { appApi, userEvent } = renderDashboard({
      appApi: {
        getFilePath: () => '/moo.mp3',
      },
      route: DashboardRoute.Sounds,
    });

    expect(screen.getByRole('button', { name: 'Add new sound' })).toBeInTheDocument();

    await userEvent.upload(screen.getByTestId('add-sound-input'), newSound);

    const customSoundItem = screen.getByRole('listitem', { name: 'Custom sound: moo.mp3' });

    expect(within(customSoundItem).getByLabelText('Name')).toHaveValue('moo.mp3');
    expect(within(customSoundItem).getByRole('textbox', { name: 'Path' })).toHaveValue('/moo.mp3');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(
      screen.queryByRole('listitem', {
        name: 'Custom sound: moo.mp3',
      })
    ).not.toBeInTheDocument();

    vi.mocked(nanoid).mockReturnValue('abc');

    await userEvent.upload(screen.getByTestId('add-sound-input'), newSound);
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      sounds: {
        abc: {
          name: 'moo.mp3',
          path: '/moo.mp3',
        },
      },
    });
  });
});
