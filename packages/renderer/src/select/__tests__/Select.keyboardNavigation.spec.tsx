import { renderSelect, screen } from '../__fixtures__/renderSelect';

describe('Select - Keyboard Navigation', () => {
  it('should select the next option on arrow down keys', async () => {
    const { userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'group-one', label: 'Group One', type: 'group', items: [] },
          {
            id: 'group-two',
            label: 'Group two',
            type: 'group',
            items: [
              { id: 'group-two-one', label: 'Group Two - One' },
              {
                id: 'group-two-group-one',
                label: 'Group Two - Group One',
                type: 'group',
                items: [],
              },
              {
                id: 'group-two-group-two',
                label: 'Group Two - Group Two',
                type: 'group',
                items: [],
              },
              { id: 'group-two-two', label: 'Group Two - Two' },
            ],
          },
          { id: 'three', label: 'Three' },
          {
            id: 'group-three',
            label: 'Group Three',
            type: 'group',
            items: [{ id: 'group-three-one', label: 'Group Three - One' }],
          },
        ],
      },
    });

    const optionIds = ['two', 'group-two-one', 'group-two-two', 'three', 'group-three-one'];

    for (const optionId of optionIds) {
      await userEvent.type(screen.getByRole('combobox'), '{ArrowDown}');

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', optionId);
    }
  });

  it('should select the previous option on arrow up keys', async () => {
    const { userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'group-one', label: 'Group One', type: 'group', items: [] },
          {
            id: 'group-two',
            label: 'Group two',
            type: 'group',
            items: [
              { id: 'group-two-one', label: 'Group Two - One' },
              {
                id: 'group-two-group-one',
                label: 'Group Two - Group One',
                type: 'group',
                items: [],
              },
              {
                id: 'group-two-group-two',
                label: 'Group Two - Group Two',
                type: 'group',
                items: [],
              },
              { id: 'group-two-two', label: 'Group Two - Two' },
            ],
          },
          { id: 'three', label: 'Three' },
          {
            id: 'group-three',
            label: 'Group Three',
            type: 'group',
            items: [{ id: 'group-three-one', label: 'Group Three - One' }],
          },
        ],
      },
    });

    const lastOption = await screen.findByRole('option', { name: 'Group Three - One' });

    await userEvent.hover(lastOption);

    const optionIds = ['three', 'group-two-two', 'group-two-one', 'two', 'one'];

    for (const optionId of optionIds) {
      await userEvent.type(screen.getByRole('combobox'), '{ArrowUp}');

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', optionId);
    }
  });

  it('should select the next option on tab keys', async () => {
    const { userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ],
      },
    });

    // I don't know why we need to use 4 to simulate 2 Tabs, but there we go.
    await userEvent.type(screen.getByRole('combobox'), '{Tab>4}');

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'two');

    await userEvent.type(screen.getByRole('combobox'), '{Shift>}{Tab}');

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'one');
  });

  it('should select the first open on the home key', async () => {
    const { userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'three', label: 'Three' },
        ],
      },
    });

    const lastOption = await screen.findByRole('option', { name: 'Three' });

    await userEvent.hover(lastOption);
    await userEvent.type(screen.getByRole('combobox'), '{Home}');

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'one');
  });

  it('should select the last open on the end key', async () => {
    const { userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'three', label: 'Three' },
        ],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), '{End}');

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'three');
  });

  it('should not throw an error on keyboard navigation when there are no options', async () => {
    const { userEvent } = renderSelect({});

    await userEvent.type(screen.getByRole('combobox'), '{Home}');

    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');

    await userEvent.type(screen.getByRole('combobox'), '{End}');

    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  });
});
