import { useTranslate } from '@/shared/context/RuntimeContext';
import cc from 'classcat';
import { Component, For, JSX, createEffect, createMemo, createSignal } from 'solid-js';
import styles from './ActionsMenu.module.scss';
import MoreIcon from './assets/more.svg';

export type Action = {
  content: string;
  onClick(): void;
};

type ActionsMenuProps = {
  actions: Action[];
  menuLabel?: string;
  tooltip?: string;
  tooltipPosition?: 'center' | 'left' | 'right';
  triggerLabel?: string;
};

export const ActionsMenu: Component<ActionsMenuProps> = props => {
  const t = useTranslate();

  const actionMetaMap: WeakMap<Action, { element: HTMLLIElement; index: number }> = new WeakMap();

  const [getIsExpanded, setIsExpanded] = createSignal(false);
  const [getActiveAction, setActiveAction] = createSignal<Action | undefined>(undefined);

  const getActiveActionMeta = createMemo(() => {
    const activeAction = getActiveAction();

    return activeAction ? actionMetaMap.get(activeAction) : undefined;
  });

  createEffect(() => {
    getActiveActionMeta()?.element.focus();
  });

  createEffect(() => {
    if (getIsExpanded()) {
      setActiveAction(props.actions.at(0));

      document.body.addEventListener('click', handleOutsideClick);
    } else {
      setActiveAction(undefined);

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
      highlightNextAction();
    } else if (event.key === 'ArrowUp') {
      highlightPreviousAction();
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      closeMenu(true);
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      triggerActiveAction();
    } else if (event.key === 'Home') {
      highlightFirstAction();
    } else if (event.key === 'End') {
      highlightLastAction();
    }
  };

  const handleActionClick = (callback: () => void) => {
    callback();
    closeMenu();
  };

  const closeMenu = (shouldReturnFocus = false) => {
    setIsExpanded(false);

    if (shouldReturnFocus) {
      buttonRef.focus();
    }
  };

  const triggerActiveAction = () => {
    const activeAction = getActiveAction();

    if (activeAction) {
      activeAction.onClick();
      closeMenu(true);
    }
  };

  const highlightFirstAction = () => {
    const firstAction = props.actions.at(0);

    if (firstAction) {
      setActiveAction(firstAction);
    }
  };

  const highlightLastAction = () => {
    const lastAction = props.actions.at(-1);

    if (lastAction) {
      setActiveAction(lastAction);
    }
  };

  const highlightNextAction = () => {
    const actionMeta = getActiveActionMeta();

    if (actionMeta) {
      const nextAction = props.actions.at(actionMeta.index + 1);

      if (nextAction) {
        setActiveAction(nextAction);
      } else {
        highlightFirstAction();
      }
    }
  };

  const highlightPreviousAction = () => {
    const actionMeta = getActiveActionMeta();

    if (actionMeta) {
      const previousAction = props.actions.at(actionMeta.index - 1);

      if (previousAction) {
        setActiveAction(previousAction);
      } else {
        highlightLastAction();
      }
    }
  };

  const setActionMeta = (action: Action, element: HTMLLIElement, index: number) => {
    actionMetaMap.set(action, { element, index });
  };

  let buttonRef: HTMLButtonElement;
  let listRef: HTMLUListElement;

  return (
    <div class={styles.actionsMenu}>
      <button
        aria-expanded={getIsExpanded()}
        aria-haspopup
        aria-label={props.triggerLabel ?? t('moreActionsLabel')}
        class={cc({
          [styles.button]: true,
          [styles.active]: getIsExpanded(),
        })}
        data-tooltip={props.tooltip ?? t('moreActionsShortLabel')}
        data-tooltip-position={props.tooltipPosition ?? 'center'}
        onClick={handleButtonClick}
        ref={buttonRef!}
      >
        <MoreIcon />
      </button>
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
              onClick={[handleActionClick, action.onClick]}
              onMouseOver={[setActiveAction, action]}
              ref={element => setActionMeta(action, element, getIndex())}
              role="menuitem"
              tabIndex={getActiveAction() === action ? 0 : -1}
            >
              {action.content}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
