import cc from 'classcat';
import { nanoid } from 'nanoid';
import { Component, JSX, Show, splitProps } from 'solid-js';
import styles from './Input.module.scss';

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
};

export const Input: Component<InputProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['class', 'errorMessage', 'style']);

  const anchorId = `--${nanoid()}`;

  return (
    <>
      <Show when={props.errorMessage}>
        {getErrorMessage => (
          // eslint-disable-next-line solid/style-prop
          <small class={styles.error} role="status" style={{ 'position-anchor': anchorId }}>
            {getErrorMessage()}
          </small>
        )}
      </Show>
      <input
        class={cc([
          props.class,
          {
            [styles.input]: true,
            [styles.hasError]: !!props.errorMessage,
          },
        ])}
        style={{ 'anchor-name': anchorId }}
        {...remainingProps}
      />
    </>
  );
};
