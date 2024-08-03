import cc from 'classcat';
import { Component, JSX } from 'solid-js';
import styles from './ButtonLink.module.scss';

type ButtonLinkProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonLink: Component<ButtonLinkProps> = props => {
  return <button {...props} class={cc([styles.buttonLink, props.class])} />;
};
