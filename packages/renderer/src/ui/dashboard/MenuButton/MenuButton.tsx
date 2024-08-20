import { nanoid } from 'nanoid';
import {
  Accessor,
  Component,
  For,
  JSX,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
} from 'solid-js';
import { Button, ButtonProps } from '../Button';
import styles from './MenuButton.module.scss';

type MenuButtonProps = ButtonProps & {
  menuItems: MenuItem[];
  menuLabel?: string;
  ref?(element: HTMLButtonElement): void;
};

export type MenuItem = {
  onClick(): void;
  text: string;
};

export const MenuButton: Component<MenuButtonProps> = allProps => {
  const [props, buttonProps] = splitProps(allProps, ['menuItems', 'menuLabel', 'ref']);

  const [getIsExpanded, setIsExpanded] = createSignal(false);
  const [getActiveIndex, setActiveIndex] = createSignal<number | null>(null);

  createEffect(() => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      // Wait until rendering is finished
      setTimeout(() => {
        menuItemElements.at(activeIndex)?.focus();
      }, 0);
    }
  });

  const handlePopoverToggle = (event: Event) => {
    if ((event as ToggleEvent).newState === 'open') {
      setIsExpanded(true);
      setActiveIndex(0);
    } else {
      setIsExpanded(false);
      setActiveIndex(null);
    }
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
      triggerActiveMenuItem();
    } else if (event.key === 'Home') {
      event.preventDefault();
      highlightFirstAction();
    } else if (event.key === 'End') {
      event.preventDefault();
      highlightLastAction();
    } else if (event.key === 'Tab') {
      closeMenu();
    }
  };

  const handleMenuItemMouseOver = (getIndex: Accessor<number>) => {
    setActiveIndex(getIndex());
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    menuItem.onClick();

    closeMenu();
  };

  const attachButtonRef = (element: HTMLButtonElement) => {
    const prefix = element.style.anchorName ? ', ' : '';

    element.style.anchorName += `${prefix}${anchorId}`;

    props.ref?.(element);
  };

  const attachMenuRef = (element: HTMLUListElement) => {
    menuRef = element;

    menuRef.addEventListener('beforetoggle', handlePopoverToggle);

    onCleanup(() => {
      menuRef.removeEventListener('beforetoggle', handlePopoverToggle);
    });
  };

  const closeMenu = () => {
    menuRef.hidePopover();
  };

  const highlightFirstAction = () => {
    if (props.menuItems.at(0)) {
      setActiveIndex(0);
    }
  };

  const highlightLastAction = () => {
    const lastIndex = props.menuItems.length - 1;

    if (props.menuItems.at(lastIndex)) {
      setActiveIndex(lastIndex);
    }
  };

  const highlightNextAction = () => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      const nextIndex = activeIndex + 1;

      if (props.menuItems.at(nextIndex)) {
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

      if (props.menuItems.at(previousIndex)) {
        setActiveIndex(previousIndex);
      } else {
        highlightLastAction();
      }
    }
  };

  const setMenuItemElement = (element: HTMLLIElement, index: number) => {
    if (index === 0) {
      menuItemElements.length = 0;
    }

    menuItemElements.push(element);
  };

  const triggerActiveMenuItem = () => {
    const activeIndex = getActiveIndex();

    if (activeIndex !== null) {
      props.menuItems.at(activeIndex)?.onClick();

      closeMenu();
    }
  };

  const menuItemElements: HTMLLIElement[] = [];

  const anchorId = `--${nanoid()}`;
  const menuId = nanoid();

  let menuRef: HTMLUListElement;

  return (
    <>
      <Button
        {...buttonProps}
        aria-expanded={getIsExpanded()}
        aria-haspopup
        popovertarget={menuId}
        ref={attachButtonRef}
      />
      <ul
        aria-hidden={!getIsExpanded()}
        aria-label={props.menuLabel ?? buttonProps['aria-label']}
        class={styles.menu}
        id={menuId}
        onKeyDown={handleListKeyDown}
        popover
        ref={attachMenuRef}
        role="menu"
        style={{ 'position-anchor': anchorId }}
      >
        <For each={props.menuItems}>
          {(item, getIndex) => (
            <li
              class={styles.menuItem}
              onClick={[handleMenuItemClick, item]}
              onMouseOver={[handleMenuItemMouseOver, getIndex]}
              ref={element => setMenuItemElement(element, getIndex())}
              role="menuitem"
              tabIndex={getActiveIndex() === getIndex() ? 0 : -1}
            >
              {item.text}
            </li>
          )}
        </For>
      </ul>
    </>
  );
};
