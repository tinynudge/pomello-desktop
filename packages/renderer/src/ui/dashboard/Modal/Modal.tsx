import { nanoid } from 'nanoid';
import { For, JSX, ParentComponent, Show } from 'solid-js';
import { Button, ButtonProps } from '../Button';
import styles from './Modal.module.scss';

export type ModalButton = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  text: string;
};

type ModalProps = {
  buttons?: ButtonProps[];
  heading: string;
  onHide?(): void;
  ref?: HTMLDialogElement;
};

export const Modal: ParentComponent<ModalProps> = props => {
  const handleButtonClick = (
    button: ButtonProps,
    event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) => {
    if (typeof button?.onClick === 'object') {
      button.onClick[0](button.onClick[1], event);
    } else {
      button.onClick?.(event);
    }

    modalRef.close();
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
      onClose={() => props.onHide?.()}
      ref={element => mergeRefs(element)}
    >
      <h1 class={styles.heading} id={headingId}>
        {props.heading}
      </h1>
      {props.children}
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
