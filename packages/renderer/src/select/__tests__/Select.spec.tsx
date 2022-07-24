import { CustomSelectGroupComponent, CustomSelectOptionComponent } from '@domain';
import mountSelect, { screen } from '../__fixtures__/mountSelect';

describe('Select', () => {
  it('should show a custom placeholder', () => {
    mountSelect({
      showSelect: {
        items: [{ id: 'one', label: 'One' }],
        placeholder: 'My super select',
      },
    });

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'My super select');
  });

  it('should render a list of options', () => {
    mountSelect({
      showSelect: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ],
      },
    });

    const options = screen.getAllByRole('option');

    expect(options.at(0)).toHaveTextContent('One');
    expect(options.at(1)).toHaveTextContent('Two');
  });

  it('should render option groups', () => {
    mountSelect({
      showSelect: {
        items: [
          { id: 'one', label: 'One' },
          {
            id: 'two',
            label: 'Two Group',
            type: 'group',
            items: [{ id: 'two-one', label: 'Two - One' }],
          },
        ],
      },
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

    mountSelect({
      service: { CustomSelectOption },
      showSelect: {
        serviceId: 'mock',
        items: [{ id: 'one', label: 'One', type: 'customOption' }],
      },
    });

    expect(screen.getByRole('option')).toHaveTextContent('Custom - One');
  });

  it('should render custom option groups', () => {
    const CustomSelectGroup: CustomSelectGroupComponent = ({ group }) => (
      <>Custom Group - {group.label}</>
    );

    mountSelect({
      service: { CustomSelectGroup },
      showSelect: {
        serviceId: 'mock',
        items: [
          {
            id: 'one',
            label: 'One',
            type: 'customGroup',
            items: [{ id: 'one-one', label: 'One - One' }],
          },
        ],
      },
    });

    expect(screen.getByRole('group')).toHaveTextContent('Custom Group - One');
  });

  it('should select the option when clicked', async () => {
    const { appApi, userEvent } = mountSelect({
      showSelect: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ],
      },
    });

    await userEvent.click(screen.getByRole('option', { name: 'Two' }));

    expect(appApi.selectOption).toHaveBeenCalledWith('two');
  });

  it('should fuzzy filter options', async () => {
    const { userEvent } = mountSelect({
      showSelect: {
        items: [
          { id: 'charmander', label: 'Charmander' },
          { id: 'charizard', label: 'Charizard' },
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'ivysaur', label: 'Ivysaur' },
        ],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), 'ir');

    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(2);
    expect(options.at(0)).toHaveTextContent('Charizard');
    expect(options.at(1)).toHaveTextContent('Ivysaur');
  });

  it('should fuzzy filter groups', async () => {
    const { userEvent } = mountSelect({
      showSelect: {
        items: [
          { id: 'walk-dog', label: 'Walk the dog' },
          {
            id: 'grocery-shopping',
            label: 'Buy groceries',
            type: 'group',
            items: [
              { id: 'grocery-shopping-milk', label: 'Milk' },
              { id: 'grocery-shopping-eggs', label: 'Eggs' },
              { id: 'grocery-shopping-flour', label: 'Flour' },
            ],
          },
          { id: 'feed-cat', label: 'Feed the cat' },
          {
            id: 'sell-bicycle',
            label: 'Sell bicycle',
            type: 'group',
            items: [
              { id: 'sell-bicycle-take-photos', label: 'Take photos' },
              { id: 'sell-bicycle-post-ad', label: 'Post ad' },
            ],
          },
        ],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), 'l');

    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(3);
    expect(options.at(0)).toHaveTextContent('Walk the dog');
    expect(options.at(1)).toHaveTextContent('Milk');
    expect(options.at(2)).toHaveTextContent('Flour');

    const groups = screen.getAllByRole('group');

    expect(groups).toHaveLength(1);
    expect(groups.at(0)).toHaveTextContent('Buy groceries');
  });

  it('should show a no matches found message', async () => {
    const { userEvent } = mountSelect({
      showSelect: {
        items: [
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'ivysaur', label: 'Ivysaur' },
        ],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), 'cat');

    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('alert')).toHaveTextContent('No matches found');
  });
});
