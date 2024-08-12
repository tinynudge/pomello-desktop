import cc from 'classcat';
import { nanoid } from 'nanoid';
import { Component, JSX, createSignal, onCleanup } from 'solid-js';
import styles from './Tooltip.module.scss';

type TooltipProps = {
  children(tooltipTargetRef: TooltipTargetRef): JSX.Element;
  isForceHidden?: boolean;
  text: string;
};

type TooltipTargetRef = (element: HTMLElement) => void;

export const Tooltip: Component<TooltipProps> = props => {
  const [getIsVisible, setIsVisible] = createSignal(false);

  const handleTargetMouseOver = () => {
    setIsVisible(true);

    tooltipRef.showPopover();
  };

  const handleTargetMouseOut = () => {
    setIsVisible(false);

    tooltipRef.hidePopover();
  };

  const tooltipTargetRef: TooltipTargetRef = (element: HTMLElement) => {
    const prefix = element.style.anchorName ? ', ' : '';

    element.style.anchorName += `${prefix}${tooltipId}`;

    element.addEventListener('mouseover', handleTargetMouseOver);
    element.addEventListener('focus', handleTargetMouseOver);

    element.addEventListener('mouseout', handleTargetMouseOut);
    element.addEventListener('blur', handleTargetMouseOut);

    onCleanup(() => {
      element.removeEventListener('mouseover', handleTargetMouseOver);
      element.removeEventListener('focus', handleTargetMouseOver);

      element.removeEventListener('mouseout', handleTargetMouseOut);
      element.removeEventListener('blur', handleTargetMouseOut);
    });
  };

  const tooltipId = `--${nanoid()}`;

  let tooltipRef: HTMLDivElement;

  return (
    <>
      {props.children(tooltipTargetRef)}
      <span
        aria-hidden={!getIsVisible() || props.isForceHidden}
        class={cc({
          [styles.tooltip]: true,
          [styles.isForceHidden]: props.isForceHidden,
        })}
        popover="manual"
        ref={tooltipRef!}
        role="tooltip"
        style={{ 'position-anchor': tooltipId } as JSX.CSSProperties}
      >
        {props.text}
      </span>
    </>
  );
};
