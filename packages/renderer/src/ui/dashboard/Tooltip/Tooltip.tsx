import { nanoid } from 'nanoid';
import { Component, JSX, createSignal, onCleanup } from 'solid-js';
import styles from './Tooltip.module.scss';

type TooltipProps = {
  alignment?: 'top' | 'bottom';
  children(tooltipTargetRef: TooltipTargetRef, tooltipId: string): JSX.Element;
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

    element.style.anchorName += `${prefix}${anchorId}`;

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

  const id = nanoid();
  const tooltipId = `tooltip-${id}`;
  const anchorId = `--${id}`;

  let tooltipRef!: HTMLDivElement;

  return (
    <>
      {props.children(tooltipTargetRef, tooltipId)}
      <span
        aria-hidden={!getIsVisible()}
        class={styles.tooltip}
        data-alignment={props.alignment ?? 'top'}
        id={tooltipId}
        popover="manual"
        ref={tooltipRef}
        role="tooltip"
        // eslint-disable-next-line solid/style-prop
        style={{ 'position-anchor': anchorId }}
      >
        {props.text}
      </span>
    </>
  );
};
