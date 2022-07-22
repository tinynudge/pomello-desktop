import { CustomSelectGroupComponent, CustomSelectOptionComponent } from '@domain';
import mountSelect, { screen } from '../__fixtures__/mountSelect';

describe('Select', () => {
  it('should render a list of options', () => {
    const { emitAppApiEvent } = mountSelect();

    emitAppApiEvent('onSelectShow', {
      items: [
        { id: 'one', label: 'One' },
        { id: 'two', label: 'Two' },
      ],
    });

    const options = screen.getAllByRole('option');

    expect(options.at(0)).toHaveTextContent('One');
    expect(options.at(1)).toHaveTextContent('Two');
  });

  it('should render option groups', () => {
    const { emitAppApiEvent } = mountSelect();

    emitAppApiEvent('onSelectShow', {
      items: [
        { id: 'one', label: 'One' },
        {
          id: 'two',
          label: 'Two Group',
          type: 'group',
          items: [{ id: 'two-one', label: 'Two - One' }],
        },
      ],
    });

    const options = screen.getAllByRole('option');

    expect(options.at(0)).toHaveTextContent('One');
    expect(options.at(1)).toHaveTextContent('Two - One');
    expect(screen.getByRole('group')).toHaveTextContent('Two Group');
  });

  it('should render custom options', () => {
    const CustomSelectOption: CustomSelectOptionComponent = ({ option }) => (
      <>Custom - {option.label}</>
    );

    const { emitAppApiEvent } = mountSelect({
      service: { CustomSelectOption },
    });

    emitAppApiEvent('onSelectShow', {
      serviceId: 'mock',
      items: [{ id: 'one', label: 'One', type: 'customOption' }],
    });

    expect(screen.getByRole('option')).toHaveTextContent('Custom - One');
  });

  it('should render custom option groups', () => {
    const CustomSelectGroup: CustomSelectGroupComponent = ({ group }) => (
      <>Custom Group - {group.label}</>
    );

    const { emitAppApiEvent } = mountSelect({
      service: { CustomSelectGroup },
    });

    emitAppApiEvent('onSelectShow', {
      serviceId: 'mock',
      items: [
        {
          id: 'one',
          label: 'One',
          type: 'customGroup',
          items: [{ id: 'one-one', label: 'One - One' }],
        },
      ],
    });

    expect(screen.getByRole('group')).toHaveTextContent('Custom Group - One');
  });

  it('should select the option when clicked', async () => {
    const { appApi, emitAppApiEvent, userEvent } = mountSelect();

    const items = [
      { id: 'one', label: 'One' },
      { id: 'two', label: 'Two' },
    ];

    emitAppApiEvent('onSelectShow', { items });

    await userEvent.click(screen.getByRole('option', { name: items[1].label }));

    expect(appApi.selectOption).toHaveBeenCalledWith(items[1]);
  });
});
