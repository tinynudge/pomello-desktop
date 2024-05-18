import { JSX, ParentComponent } from 'solid-js';

interface DialActionProps {
  class: string;
  isVisible: boolean;
  label: string;
  onClick(): void;
  title: string;
}

export const DialAction: ParentComponent<DialActionProps> = props => {
  const handleButtonClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = event => {
    event.currentTarget.blur();
    props.onClick();
  };

  return (
    <button
      aria-hidden={!props.isVisible}
      aria-label={props.label}
      class={props.class}
      onClick={handleButtonClick}
      tabIndex={props.isVisible ? 0 : -1}
      title={props.title}
    >
      {props.children}
    </button>
  );
};
