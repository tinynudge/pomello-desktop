import { renderDashboardComponent, screen } from '../__fixtures__/renderDashboardComponent';
import { Modal } from './Modal';

describe('UI - Modal', () => {
  it('should render the modal', () => {
    let modalRef!: HTMLDialogElement;

    renderDashboardComponent(() => <Modal heading="Danger" ref={modalRef} />);

    modalRef.showModal();

    expect(screen.getByRole('dialog', { name: 'Danger' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Danger' })).toBeInTheDocument();
  });

  it('should render modal buttons', async () => {
    let modalRef!: HTMLDialogElement;

    const { userEvent } = renderDashboardComponent(() => (
      <Modal buttons={[{ children: 'Acknowledge' }]} heading="Danger" ref={modalRef} />
    ));

    modalRef.showModal();

    expect(screen.getByRole('button', { name: 'Acknowledge' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Acknowledge' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onHide callback when modal closes', () => {
    let modalRef!: HTMLDialogElement;
    const handleHide = vi.fn();

    renderDashboardComponent(() => <Modal heading="Danger" onHide={handleHide} ref={modalRef} />);

    modalRef.showModal();
    modalRef.close();

    expect(handleHide).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when button has preventClose', async () => {
    let modalRef!: HTMLDialogElement;

    const { userEvent } = renderDashboardComponent(() => (
      <Modal
        buttons={[
          {
            children: 'Keep Open',
            preventClose: true,
          },
        ]}
        heading="Danger"
        ref={modalRef}
      />
    ));

    modalRef.showModal();

    await userEvent.click(screen.getByRole('button', { name: 'Keep Open' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should call button onClick handler when clicked', async () => {
    let modalRef!: HTMLDialogElement;
    const onClick = vi.fn();

    const { userEvent } = renderDashboardComponent(() => (
      <Modal buttons={[{ children: 'Action', onClick, preventClose: true }]} heading="Danger" ref={modalRef} />
    ));

    modalRef.showModal();

    await userEvent.click(screen.getByRole('button', { name: 'Action' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle button onClick as tuple callback', async () => {
    let modalRef!: HTMLDialogElement;
    const onClick = vi.fn();
    const buttonData = { id: 'test-button', value: 'test-value' };

    const { userEvent } = renderDashboardComponent(() => (
      <Modal
        buttons={[{ children: 'Action', onClick: [onClick, buttonData], preventClose: true }]}
        heading="Danger"
        ref={modalRef}
      />
    ));

    modalRef.showModal();

    await userEvent.click(screen.getByRole('button', { name: 'Action' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(buttonData, expect.any(Object));
  });
});
