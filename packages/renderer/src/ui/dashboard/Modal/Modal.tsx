import { nanoid } from 'nanoid';
import { For, ParentComponent, Show, onMount } from 'solid-js';
import { Button, ButtonProps } from '../Button';
import styles from './Modal.module.scss';

export type ModalButtonProps = ButtonProps & {
  preventClose?: boolean;
};

type ModalProps = {
  buttons?: ModalButtonProps[];
  heading: string;
  onHide?(): void;
  padding?: 'default' | 'none';
  ref?: HTMLDialogElement | ((element: HTMLDialogElement) => void);
  showOnMount?: boolean;
};

export const Modal: ParentComponent<ModalProps> = props => {
  onMount(() => {
    if (props.showOnMount) {
      modalRef.showModal();
    }
  });

  const handleButtonClick = (
    button: ModalButtonProps,
    event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) => {
    if (typeof button?.onClick === 'object') {
      button.onClick[0](button.onClick[1], event);
    } else {
      button.onClick?.(event);
    }

    if (!button.preventClose) {
      modalRef.close();
    }
  };

  const handleModalClose = () => {
    props.onHide?.();
  };

  const mergeRefs = (element: HTMLDialogElement) => {
    /* @ts-expect-error Solid uses the callback form when forwarding refs */
    props.ref?.(element);
    modalRef = element;
  };

  let modalRef: HTMLDialogElement;

  const headingId = nanoid();

  return (
    <dialog
      aria-labelledby={headingId}
      class={styles.modal}
      onClose={handleModalClose}
      ref={element => mergeRefs(element)}
    >
      <h1 class={styles.heading} id={headingId}>
        {props.heading}
      </h1>
      <div class={styles.content} data-padding={props.padding}>
        {props.children}
      </div>
      <Show when={props.buttons}>
        {getButtons => (
          <div class={styles.buttons}>
            <For each={getButtons()}>
              {button => <Button {...button} onClick={[handleButtonClick, button]} />}
            </For>
          </div>
        )}
      </Show>
    </dialog>
  );
};
