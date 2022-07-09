import { FC, ReactNode } from 'react';

interface DropdownRowProps {
  children: ReactNode;
  depth: number;
  onClick?(): void;
}

const DropdownRow: FC<DropdownRowProps> = ({ children, depth, onClick }) => {
  return (
    <div
      style={{
        border: '1px solid black',
        paddingLeft: 20 * depth,
        marginBottom: -1,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default DropdownRow;
