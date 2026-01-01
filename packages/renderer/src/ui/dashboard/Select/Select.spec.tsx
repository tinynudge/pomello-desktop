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

  it('should render an error', async () => {
    renderDashboardComponent(() => (
      <Select options={[]} message={{ type: 'error', text: 'You shall not pass' }} />
    ));

    expect(screen.getByRole('status')).toHaveTextContent('You shall not pass');
  });

  it('should render a warning', async () => {
    renderDashboardComponent(() => (
      <Select options={[]} message={{ type: 'warning', text: 'This is a warning' }} />
    ));

    expect(screen.getByRole('status')).toHaveTextContent('This is a warning');
  });
});
