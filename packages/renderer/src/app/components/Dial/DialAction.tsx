import { FC, MouseEvent, ReactNode } from 'react';

interface DialActionProps {
  children: ReactNode;
  className: string;
  isVisible: boolean;
  label: string;
  onClick(): void;
  title: string;
}

const DialAction: FC<DialActionProps> = ({
  children,
  className,
  isVisible,
  label,
  onClick,
  title,
}) => {
  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    onClick();
  };

  return (
    <button
      aria-hidden={!isVisible}
      aria-label={label}
      className={className}
      onClick={handleButtonClick}
      tabIndex={isVisible ? 0 : -1}
      title={title}
    >
      {children}
    </button>
  );
};

export default DialAction;
