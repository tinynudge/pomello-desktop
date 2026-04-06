import { useTranslate } from '@/shared/context/RuntimeContext';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { Match, onMount, ParentComponent, Switch } from 'solid-js';
import styles from './EventContainer.module.scss';

type EventContainerProps = {
  ariaLabel: string;
  class: string;
  isActive: boolean;
  isHighlighted: boolean;
  mode: 'edit' | 'view';
  onEventEdit(): void;
};

export const EventContainer: ParentComponent<EventContainerProps> = props => {
  const t = useTranslate();

  onMount(() => {
    if (props.isHighlighted && buttonRef) {
      buttonRef.dataset.highlighted = '';
      buttonRef.scrollIntoView({ block: 'center' });
      buttonRef.focus({ preventScroll: true });

      buttonRef.addEventListener(
        'animationend',
        () => {
          delete buttonRef?.dataset.highlighted;
        },
        { once: true }
      );
    }
  });

  let buttonRef: HTMLButtonElement | undefined;

  return (
    <Switch>
      <Match when={props.mode === 'view'}>
        <Tooltip text={t('event.editEvent')}>
          {tooltipRef => (
            <button
              aria-label={props.ariaLabel}
              class={props.class}
              classList={{ [styles.clickable]: true }}
              onClick={props.onEventEdit}
              ref={ref => {
                tooltipRef(ref);
                buttonRef = ref;
              }}
            >
              {props.children}
            </button>
          )}
        </Tooltip>
      </Match>
      <Match when={props.mode === 'edit'}>
        <div class={props.class} data-active={props.isActive ? '' : undefined}>
          {props.children}
        </div>
      </Match>
    </Switch>
  );
};
