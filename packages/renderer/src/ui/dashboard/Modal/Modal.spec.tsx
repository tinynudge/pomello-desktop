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
});
