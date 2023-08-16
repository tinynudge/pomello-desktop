import { FC, useState } from 'react';
import { vi } from 'vitest';
import SelectField from '.';
import mountComponent, { screen, waitFor } from '../__fixtures__/mountComponent';

describe('UI - Select Field', () => {
  it('should render the placeholder', () => {
    mountComponent(<SelectField items={[]} onChange={vi.fn()} placeholder="Foobar" />);

    expect(screen.getByRole('button')).toHaveTextContent('Foobar');
  });

  it('should tell the select window what items to show', () => {
    const { appApi } = mountComponent(
      <SelectField
        items={[
          { id: 'bulbasaur', label: 'Bulbasaur' },
          { id: 'charmander', label: 'Charmander' },
        ]}
        onChange={vi.fn()}
        placeholder="Pick a Pokemon"
      />
    );

    expect(appApi.setSelectItems).toHaveBeenCalledWith({
      items: [
        { id: 'bulbasaur', label: 'Bulbasaur' },
        { id: 'charmander', label: 'Charmander' },
      ],
      placeholder: 'Pick a Pokemon',
    });
  });

  it('should open the select automatically if specified', async () => {
    const { appApi } = mountComponent(
      <SelectField defaultOpen items={[]} onChange={vi.fn()} placeholder="Pick a Pokemon" />
    );

    await waitFor(() => {
      expect(appApi.showSelect).toHaveBeenCalled();
    });
  });

  it('should open the select when clicked', async () => {
    const { appApi, userEvent } = mountComponent(<SelectField items={[]} onChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('button'));

    expect(appApi.showSelect).toHaveBeenCalled();
  });

  it('should open the select when the space bar is pressed', async () => {
    const { appApi, userEvent } = mountComponent(<SelectField items={[]} onChange={vi.fn()} />);

    await userEvent.keyboard(' ');

    expect(appApi.showSelect).toHaveBeenCalled();
  });

  it('should call the change handler when an option has been selected', async () => {
    const onSelectChange = vi.fn();

    const { emitAppApiEvent } = mountComponent(
      <SelectField items={[]} onChange={onSelectChange} />
    );

    emitAppApiEvent('onSelectChange', 'foo');

    expect(onSelectChange).toHaveBeenCalledWith('foo');
  });

  it('should reset the select when unmounted', async () => {
    const Container: FC = () => {
      const [showSelect, setShowSelect] = useState(true);

      return (
        <>
          <button onClick={() => setShowSelect(false)}>Hide select</button>
          {showSelect && <SelectField items={[]} onChange={vi.fn()} />}
        </>
      );
    };

    const { appApi, userEvent } = mountComponent(<Container />);

    await userEvent.click(screen.getByRole('button', { name: 'Hide select' }));

    expect(appApi.resetSelect).toHaveBeenCalled();
  });
});
