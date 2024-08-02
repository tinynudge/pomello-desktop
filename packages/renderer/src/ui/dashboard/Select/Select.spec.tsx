import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Select } from './Select';

describe('UI - Select', () => {
  it('should render the select', async () => {
    renderDashboardComponent(() => (
      <Select
        aria-label="Count"
        options={[
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ]}
      />
    ));

    expect(screen.getByRole('combobox', { name: 'Count' })).toBeInTheDocument();
  });

  it('should select a default value', async () => {
    renderDashboardComponent(() => (
      <Select
        options={[
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ]}
        value="two"
      />
    ));

    expect(screen.getByRole('combobox')).toHaveValue('two');
  });

  it('should trigger the onChange handler', async () => {
    const handleSelectChange = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <Select
        onChange={handleSelectChange}
        options={[
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ]}
      />
    ));

    await userEvent.selectOptions(screen.getByRole('combobox'), 'Two');

    expect(handleSelectChange).toHaveBeenCalledOnce();
    expect(handleSelectChange).toHaveBeenCalledWith('two');
  });
});
