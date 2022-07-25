import cc from 'classcat';
import { FC, HTMLAttributes, ReactNode } from 'react';
import styles from './DropdownRow.module.scss';

interface DropdownRowProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
  onClick?(): void;
}

const DropdownRow: FC<DropdownRowProps> = ({ children, className, onClick, ...remainingProps }) => {
  return (
    <li className={cc([styles.row, className])} data-row onClick={onClick} {...remainingProps}>
      {children}
    </li>
  );
};

export default DropdownRow;
