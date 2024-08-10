import cc from 'classcat';
import styles from './Buttons.module.scss';
import { JSX, ParentComponent, splitProps } from 'solid-js';

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'text';
};

export const Button: ParentComponent<ButtonProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['children', 'class', 'variant']);

  return (
    <button
      {...remainingProps}
      class={cc([styles.button, props.class])}
      data-variant={props.variant}
    >
      {props.children}
    </button>
  );
};
