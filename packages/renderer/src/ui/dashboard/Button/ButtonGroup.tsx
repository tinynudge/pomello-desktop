import { JSX, ParentComponent, splitProps } from 'solid-js';
import styles from './Buttons.module.scss';

export const ButtonGroup: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = initialProps => {
  const [props, rest] = splitProps(initialProps, ['children']);

  return (
    <div class={styles.buttonGroup} role="group" {...rest}>
      {props.children}
    </div>
  );
};
