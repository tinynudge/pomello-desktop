import { CustomSelectGroupComponent, CustomSelectOptionComponent } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { renderSelect, screen, waitFor } from '../__fixtures__/renderSelect';

describe('Select', () => {
  it('should show a custom placeholder', () => {
    renderSelect({
      setSelectItems: {
        items: [{ id: 'one', label: 'One' }],
        placeholder: 'My super select',
      },
    });

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'My super select');
  });

  it('should render a list of options', async () => {
    renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ],
      },
    });

    const options = await screen.findAllByRole('option');

    expect(options.at(0)).toHaveTextContent('One');
    expect(options.at(1)).toHaveTextContent('Two');
  });

  it('should show a message if the list is empty', () => {
    renderSelect({
      setSelectItems: {
        items: [],
      },
    });

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('should show a custom no results message', () => {
    renderSelect({
      setSelectItems: {
        items: [],
        noResultsMessage: 'Say the magic word',
      },
    });

    expect(screen.getByText('Say the magic word')).toBeInTheDocument();
  });

  it('should render hints for options', async () => {
    renderSelect({
      setSelectItems: {
        items: [{ hint: 'Click me!', id: 'one', label: 'One' }],
      },
    });

    const option = await screen.findByRole('option');

    expect(option).toHaveTextContent('Click me!');
  });

  it('should render hints for option groups', async () => {
    renderSelect({
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

    const group = await screen.findByRole('group');

    expect(group).toHaveTextContent('Stay away!');
  });

  it('should render option groups', async () => {
    renderSelect({
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

    const options = await screen.findAllByRole('option');

    expect(options.at(0)).toHaveTextContent('One');
    expect(options.at(1)).toHaveTextContent('Two - One');
    expect(screen.getByRole('group')).toHaveTextContent('Two Group');
  });

  it('should render custom options', async () => {
    const CustomSelectOption: CustomSelectOptionComponent = props => <>Custom - {props.option.label}</>;

    renderSelect({
      service: { CustomSelectOption },
      serviceId: 'mock',
      setSelectItems: {
        items: [{ id: 'one', label: 'One', type: 'customOption' }],
      },
    });

    const option = await screen.findByRole('option');

    expect(option).toHaveTextContent('Custom - One');
  });

  it('should render custom option groups', async () => {
    const CustomSelectGroup: CustomSelectGroupComponent = props => <>Custom Group - {props.group.label}</>;

    renderSelect({
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

    const group = await screen.findByRole('group');

    expect(group).toHaveTextContent('Custom Group - One');
  });

  it('should select the option when clicked', async () => {
    const { appApi, userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ],
      },
    });

    const option = await screen.findByRole('option', { name: 'Two' });

    await userEvent.click(option);

    expect(appApi.selectOption).toHaveBeenCalledWith('two');
  });

  it('should fuzzy filter options', async () => {
    const { userEvent } = renderSelect({
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
    const { userEvent } = renderSelect({
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
    const { userEvent } = renderSelect({
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
    const { appApi, emitAppApiEvent, userEvent } = renderSelect({
      setSelectItems: {
        items: [
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'ivysaur', label: 'Ivysaur' },
        ],
      },
    });

    emitAppApiEvent('onShowSelect', { orientation: 'bottom' });

    await userEvent.type(screen.getByRole('combobox'), 'sur');

    expect(appApi.setSelectBounds).toHaveBeenCalledWith(expect.objectContaining({ orientation: 'bottom' }));
  });

  it('should hide the select when the escape key is pressed', async () => {
    const { appApi, userEvent } = renderSelect({
      setSelectItems: {
        items: [],
      },
    });

    await userEvent.type(screen.getByRole('combobox'), '{Escape}');

    expect(appApi.hideSelect).toHaveBeenCalled();
  });

  it('should reset the state when the select is hidden', async () => {
    const { emitAppApiEvent, userEvent } = renderSelect({
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

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue('');
      expect(screen.getAllByRole('option')).toHaveLength(4);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'charmander');
    });
  });

  it('should select the first available option if the previous active option was filtered out', async () => {
    const { userEvent } = renderSelect({
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

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'ivysaur');

    await userEvent.type(screen.getByRole('combobox'), 'ch', {
      initialSelectionStart: 0,
      initialSelectionEnd: 3,
    });

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', 'charmander');
  });

  it('should scroll the window to the top or bottom of the active option', async () => {
    const { userEvent } = renderSelect({
      setSelectItems: {
        items: [{ id: 'ivysaur', label: 'Ivysaur' }],
      },
    });

    const previousInnerHeight = window.innerHeight;
    const getBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {});

    getBoundingClientRect.mockReturnValue({ height: 0 } as DOMRect);
    getBoundingClientRect.mockReturnValueOnce({ top: -50, bottom: 0 } as DOMRect);

    const option = await screen.findByRole('option', { name: 'Ivysaur' });

    await userEvent.hover(option);
    await userEvent.type(screen.getByRole('combobox'), 'i');

    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ top: -50 }));

    window.innerHeight = 120;
    getBoundingClientRect.mockReturnValue({ top: 0, bottom: 150 } as DOMRect);

    await userEvent.type(screen.getByRole('combobox'), '{Backspace}');

    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ top: 30 }));

    window.innerHeight = previousInnerHeight;
    scrollBy.mockRestore();
    getBoundingClientRect.mockRestore();
  });
});
