import { CustomSelectGroupComponent, CustomSelectOptionComponent } from '@domain';
import { vi } from 'vitest';
import mountSelect, { fireEvent, screen, waitFor } from '../__fixtures__/mountSelect';

describe('Select', () => {
  it('should show a custom placeholder', () => {
    mountSelect({
      setSelectItems: {
        items: [{ id: 'one', label: 'One' }],
        placeholder: 'My super select',
      },
    });

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'My super select');
  });

  it('should render a list of options', () => {
    mountSelect({
      setSelectItems: {
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

  it('should render hints for options', () => {
    mountSelect({
      setSelectItems: {
        items: [{ hint: 'Click me!', id: 'one', label: 'One' }],
      },
    });

    expect(screen.getByRole('option')).toHaveTextContent('Click me!');
  });

  it('should render hints for option groups', () => {
    mountSelect({
      setSelectItems: {
        items: [
          {
            hint: 'Stay away!',
            id: 'mama-group',
            label: 'Mama group',
            type: 'group',
            items: [{ id: 'child', label: 'Child option' }],
          },
        ],
      },
    });

    expect(screen.getByRole('group')).toHaveTextContent('Stay away!');
  });

  it('should render option groups', () => {
    mountSelect({
      setSelectItems: {
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

  it('should render custom options', async () => {
    const CustomSelectOption: CustomSelectOptionComponent = ({ option }) => (
      <>Custom - {option.label}</>
    );

    mountSelect({
      service: { CustomSelectOption },
      serviceId: 'mock',
      setSelectItems: {
        items: [{ id: 'one', label: 'One', type: 'customOption' }],
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('option')).toHaveTextContent('Custom - One');
    });
  });

  it('should render custom option groups', async () => {
    const CustomSelectGroup: CustomSelectGroupComponent = ({ group }) => (
      <>Custom Group - {group.label}</>
    );

    mountSelect({
      service: { CustomSelectGroup },
      serviceId: 'mock',
      setSelectItems: {
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

    await waitFor(() => {
      expect(screen.getByRole('group')).toHaveTextContent('Custom Group - One');
    });
  });

  it('should select the option when clicked', async () => {
    const { appApi, userEvent } = mountSelect({
      setSelectItems: {
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
      setSelectItems: {
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
      setSelectItems: {
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
      setSelectItems: {
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

  it('should pass the window orientation when updating the bounds', async () => {
    const { appApi, emitAppApiEvent, userEvent } = mountSelect({
      setSelectItems: {
        items: [
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'ivysaur', label: 'Ivysaur' },
        ],
      },
    });

    emitAppApiEvent('onShowSelect', { orientation: 'bottom' });

    await userEvent.type(screen.getByRole('combobox'), 'sur');

    expect(appApi.setSelectBounds).toHaveBeenCalledWith(
      expect.objectContaining({ orientation: 'bottom' })
    );
  });

  it('should hide the select when the escape key is pressed', async () => {
    const { appApi, userEvent } = mountSelect({
      setSelectItems: {
        items: [],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), '{Escape}');

    expect(appApi.hideSelect).toHaveBeenCalled();
  });

  it('should reset the state when the select is hidden', async () => {
    const { emitAppApiEvent, userEvent } = mountSelect({
      setSelectItems: {
        items: [
          { id: 'charmander', label: 'Charmander' },
          { id: 'charizard', label: 'Charizard' },
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'ivysaur', label: 'Ivysaur' },
        ],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), 'ir');
    await userEvent.hover(screen.getByRole('option', { name: 'Ivysaur' }));

    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'ivysaur');

    emitAppApiEvent('onSelectHide');

    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'charmander');
  });

  it('should select the first available option if the previous active option was filtered out', async () => {
    const { userEvent } = mountSelect({
      setSelectItems: {
        items: [
          { id: 'charmander', label: 'Charmander' },
          { id: 'charizard', label: 'Charizard' },
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'ivysaur', label: 'Ivysaur' },
        ],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), 'ivy');
    // A resize gets triggered when the window's bounds are updated to match the filtered items
    fireEvent(window, new Event('resize'));

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'ivysaur');

    await userEvent.type(screen.getByRole('combobox'), 'ch', {
      initialSelectionStart: 0,
      initialSelectionEnd: 3,
    });
    fireEvent(window, new Event('resize'));

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'charmander');
  });

  it('should scroll the window to the top or bottom of the active option', async () => {
    const { userEvent } = mountSelect({
      setSelectItems: {
        items: [{ id: 'ivysaur', label: 'Ivysaur' }],
      },
    });

    const previousInnerHeight = window.innerHeight;
    const previousScrollBy = window.scrollBy;
    const previousGetBoundingClientRect = Element.prototype.getBoundingClientRect;

    window.scrollBy = vi.fn() as any;
    Element.prototype.getBoundingClientRect = () => ({ top: -50, bottom: 0 } as DOMRect);

    await userEvent.hover(screen.getByRole('option', { name: 'Ivysaur' }));
    await userEvent.type(screen.getByRole('combobox'), 'i');

    expect(window.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ top: -50 }));

    window.innerHeight = 120;
    Element.prototype.getBoundingClientRect = () => ({ top: 0, bottom: 150 } as DOMRect);

    await userEvent.type(screen.getByRole('combobox'), '{Backspace}');

    expect(window.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ top: 30 }));

    window.innerHeight = previousInnerHeight;
    window.scrollBy = previousScrollBy;
    Element.prototype.getBoundingClientRect = previousGetBoundingClientRect;
  });
});
