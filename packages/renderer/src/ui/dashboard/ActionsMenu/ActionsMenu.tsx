import { useTranslate } from '@/shared/context/RuntimeContext';
import cc from 'classcat';
import { Accessor, Component, For, JSX, createEffect, createSignal } from 'solid-js';
import { Tooltip } from '../Tooltip';
import styles from './ActionsMenu.module.scss';
import MoreIcon from './assets/more.svg';

export type Action = {
  onClick(): void;
  text: string;
};

type ActionsMenuProps = {
  actions: Action[];
  menuLabel?: string;
  tooltip?: string;
  triggerLabel?: string;
};

export const ActionsMenu: Component<ActionsMenuProps> = props => {
  const t = useTranslate();

  const actionElements: HTMLElement[] = [];

  const [getIsExpanded, setIsExpanded] = createSignal(false);
  const [getActiveIndex, setActiveIndex] = createSignal<number | null>(null);

  createEffect(() => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      actionElements.at(activeIndex)?.focus();
    }
  });

  createEffect(() => {
    if (getIsExpanded()) {
      setActiveIndex(0);

      document.body.addEventListener('click', handleOutsideClick);
    } else {
      setActiveIndex(null);

      document.body.removeEventListener('click', handleOutsideClick);
    }
  });

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      !(event.target instanceof HTMLElement) ||
      event.target === listRef ||
      event.target === buttonRef ||
      listRef.contains(event.target) ||
      buttonRef.contains(event.target)
    ) {
      return;
    }

    closeMenu();
  };

  const handleButtonClick = () => {
    setIsExpanded(previousIsExpanded => !previousIsExpanded);
  };

  const handleListKeyDown: JSX.EventHandler<HTMLUListElement, KeyboardEvent> = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlightNextAction();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlightPreviousAction();
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      triggerActiveAction();
    } else if (event.key === 'Home') {
      event.preventDefault();
      highlightFirstAction();
    } else if (event.key === 'End') {
      event.preventDefault();
      highlightLastAction();
    } else if (event.key === 'Escape') {
      closeMenu(true);
    } else if (event.key === 'Tab') {
      closeMenu();
    }
  };

  const handleActionMouseOver = (getIndex: Accessor<number>) => {
    setActiveIndex(getIndex());
  };

  const handleActionClick = (action: Action) => {
    action.onClick();
    closeMenu();
  };

  const closeMenu = (shouldReturnFocus = false) => {
    setIsExpanded(false);

    if (shouldReturnFocus) {
      buttonRef.focus();
    }
  };

  const triggerActiveAction = () => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      props.actions.at(activeIndex)?.onClick();

      closeMenu(true);
    }
  };

  const highlightFirstAction = () => {
    if (props.actions.at(0)) {
      setActiveIndex(0);
    }
  };

  const highlightLastAction = () => {
    const lastIndex = props.actions.length - 1;

    if (props.actions.at(lastIndex)) {
      setActiveIndex(lastIndex);
    }
  };

  const highlightNextAction = () => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      const nextIndex = activeIndex + 1;

      if (props.actions.at(nextIndex)) {
        setActiveIndex(nextIndex);
      } else {
        highlightFirstAction();
      }
    }
  };

  const highlightPreviousAction = () => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      const previousIndex = activeIndex - 1;

      if (props.actions.at(previousIndex)) {
        setActiveIndex(previousIndex);
      } else {
        highlightLastAction();
      }
    }
  };

  const setActionMeta = (element: HTMLLIElement, index: number) => {
    if (index === 0) {
      actionElements.length = 0;
    }

    actionElements.push(element);
  };

  let buttonRef: HTMLButtonElement;
  let listRef: HTMLUListElement;

  return (
    <div class={styles.actionsMenu}>
      <Tooltip text={props.tooltip ?? t('moreActionsShortLabel')} isForceHidden={getIsExpanded()}>
        {tooltipTargetRef => (
          <button
            aria-expanded={getIsExpanded()}
            aria-haspopup
            aria-label={props.triggerLabel ?? t('moreActionsLabel')}
            class={cc({
              [styles.button]: true,
              [styles.active]: getIsExpanded(),
            })}
            onClick={handleButtonClick}
            ref={element => (buttonRef = element) && tooltipTargetRef(element)}
          >
            <MoreIcon />
          </button>
        )}
      </Tooltip>
      <ul
        aria-hidden={!getIsExpanded()}
        aria-label={props.menuLabel ?? t('moreActionsShortLabel')}
        class={cc({
          [styles.list]: true,
          [styles.isExpanded]: getIsExpanded(),
        })}
        onKeyDown={handleListKeyDown}
        ref={listRef!}
        role="menu"
      >
        <For each={props.actions}>
          {(action, getIndex) => (
            <li
              class={styles.action}
              onClick={[handleActionClick, action]}
              onMouseOver={[handleActionMouseOver, getIndex]}
              ref={element => setActionMeta(element, getIndex())}
              role="menuitem"
              tabIndex={getActiveIndex() === getIndex() ? 0 : -1}
            >
              {action.text}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
