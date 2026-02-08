import cc from 'classcat';
import { JSX, ParentComponent, splitProps } from 'solid-js';
import { ButtonGroup } from './ButtonGroup';
import styles from './Buttons.module.scss';

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  iconOnly?: boolean;
  size?: 'default' | 'small';
  variant?: 'default' | 'primary' | 'text' | 'warning';
};

const ButtonComponent: ParentComponent<ButtonProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, [
    'children',
    'class',
    'iconOnly',
    'size',
    'variant',
  ]);

  return (
    <button
      {...remainingProps}
      class={cc([styles.button, props.class])}
      data-icon-only={props.iconOnly || undefined}
      data-size={props.size}
      data-variant={props.variant}
    >
      {props.children}
    </button>
  );
};

export const Button = Object.assign(ButtonComponent, {
  Group: ButtonGroup,
});
