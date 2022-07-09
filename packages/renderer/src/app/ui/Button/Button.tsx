import { ButtonHTMLAttributes, FC } from 'react';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...buttonProps }) => {
  return <button {...buttonProps}>{children}</button>;
};

export default Button;
