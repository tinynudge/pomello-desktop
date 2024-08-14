import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';
import { MenuButton, MenuItem } from '../MenuButton';
import { Tooltip } from '../Tooltip';
import styles from './ActionsMenu.module.scss';
import MoreIcon from './assets/more.svg';

type ActionsMenuProps = {
  menuItems: MenuItem[];
  menuLabel?: string;
  tooltip?: string;
  triggerLabel?: string;
};

export const ActionsMenu: Component<ActionsMenuProps> = props => {
  const t = useTranslate();

  return (
    <Tooltip text={props.tooltip ?? t('moreActionsShortLabel')}>
      {tooltipTargetRef => (
        <MenuButton
          aria-label={props.triggerLabel ?? t('moreActionsLabel')}
          class={styles.button}
          menuItems={props.menuItems}
          menuLabel={props.menuLabel ?? t('moreActionsShortLabel')}
          ref={tooltipTargetRef}
        >
          <MoreIcon />
        </MenuButton>
      )}
    </Tooltip>
  );
};
