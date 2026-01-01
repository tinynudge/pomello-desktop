import { ValidationMessage } from '@pomello-desktop/domain';
import cc from 'classcat';
import { nanoid } from 'nanoid';
import { Component, JSX, Show, splitProps } from 'solid-js';
import styles from './Input.module.scss';

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  message?: ValidationMessage;
};

export const Input: Component<InputProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['class', 'message', 'style']);
  const anchorId = `--${nanoid()}`;

  return (
    <>
      <Show when={props.message}>
        {getMessage => (
          <small
            class={styles.message}
            data-message-type={getMessage().type}
            role="status"
            // eslint-disable-next-line solid/style-prop
            style={{ 'position-anchor': anchorId }}
          >
            {getMessage().text}
          </small>
        )}
      </Show>
      <input
        {...remainingProps}
        class={cc([
          props.class,
          {
            [styles.hasError]: props.message?.type === 'error',
            [styles.hasWarning]: props.message?.type === 'warning',
            [styles.input]: true,
          },
        ])}
        style={{ 'anchor-name': anchorId }}
      />
    </>
  );
};
