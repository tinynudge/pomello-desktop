import cc from 'classcat';
import styles from './Buttons.module.scss';
import { JSX, ParentComponent, splitProps } from 'solid-js';

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'default' | 'small';
  variant?: 'default' | 'primary' | 'text' | 'warning';
};

export const Button: ParentComponent<ButtonProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['children', 'class', 'size', 'variant']);

  return (
    <button
      {...remainingProps}
      class={cc([styles.button, props.class])}
      data-size={props.size}
      data-variant={props.variant}
    >
      {props.children}
    </button>
  );
};
