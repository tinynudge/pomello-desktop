import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Add Note', () => {
  it('should show a message if unable to add a note', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const errorMessage = ['Unable to add note', { body: 'Mock service does not support this' }];

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          onNoteCreate: undefined,
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Add note' }));

    expect(NotificationMock).toHaveBeenNthCalledWith(1, ...errorMessage);

    await simulate.hotkey('addNote');

    expect(NotificationMock).toHaveBeenNthCalledWith(2, ...errorMessage);

    await simulate.hotkey('externalDistraction');

    expect(NotificationMock).toHaveBeenNthCalledWith(3, ...errorMessage);

    await simulate.hotkey('internalDistraction');

    expect(NotificationMock).toHaveBeenNthCalledWith(4, ...errorMessage);
  });

  it('should show the add note view when the dial action is clicked', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Add note' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the add note view via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('addNote');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the external distraction view via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('externalDistraction');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the internal distraction view via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('internalDistraction');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Internal distraction' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should handle when a general note is added', async () => {
    const onNoteCreate = vi.fn();

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'MY_TASK', label: 'My task' }]),
          onNoteCreate,
        },
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), 'Foo{Enter}');

    expect(onNoteCreate).toHaveBeenCalledWith('MY_TASK', {
      label: 'Note',
      text: 'Foo',
      type: 'generalNote',
    });
    expect(screen.queryByRole('heading', { name: 'Add note' })).not.toBeInTheDocument();
  });

  it('should handle when an internal distraction is added', async () => {
    const handleNoteAdd = vi.fn();

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'MY_TASK', label: 'My task' }]),
          onNoteCreate: handleNoteAdd,
        },
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.hotkey('internalDistraction');
    await userEvent.type(screen.getByRole('textbox'), 'Bar{Enter}');

    expect(handleNoteAdd).toHaveBeenCalledWith('MY_TASK', {
      label: 'Internal distraction',
      text: 'Bar',
      type: 'internalDistraction',
    });
    expect(screen.queryByRole('heading', { name: 'Internal distraction' })).not.toBeInTheDocument();
  });

  it('should handle when an external distraction is added', async () => {
    const handleNoteAdd = vi.fn();

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'MY_TASK', label: 'My task' }]),
          onNoteCreate: handleNoteAdd,
        },
      },
    });

    await simulate.selectTask('MY_TASK');
    await simulate.hotkey('externalDistraction');
    await userEvent.type(screen.getByRole('textbox'), 'Baz{Enter}');

    expect(handleNoteAdd).toHaveBeenCalledWith('MY_TASK', {
      label: 'External distraction',
      text: 'Baz',
      type: 'externalDistraction',
    });
    expect(screen.queryByRole('heading', { name: 'External distraction' })).not.toBeInTheDocument();
  });

  it('should not do anything if the input is blank', async () => {
    const onNoteCreate = vi.fn();

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          onNoteCreate,
        },
      },
    });

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), '{Enter}');

    expect(onNoteCreate).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });

  it('should hide the add note view when escape pressed', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), '{Escape}');

    expect(screen.queryByRole('heading', { name: 'Add note' })).not.toBeInTheDocument();
  });

  it('should be able to switch to a general note', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('internalDistraction');
    await userEvent.type(screen.getByRole('textbox'), `n{Tab}`);

    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });

  it('should be able to switch to an internal distraction', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), `'{Tab}`);

    expect(screen.getByRole('heading', { name: 'Internal distraction' })).toBeInTheDocument();
  });

  it('should be able to switch to an external distraction', async () => {
    const { simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), `-{Tab}`);

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
  });

  it('should trigger the help page when /? is entered', async () => {
    const { appApi, simulate, userEvent } = mountApp();

    await simulate.selectTask();
    await simulate.hotkey('addNote');
    await userEvent.type(screen.getByRole('textbox'), '/?{Enter}');

    expect(appApi.openUrl).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });
});
