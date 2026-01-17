import { useTranslate } from '@/shared/context/RuntimeContext';
import cc from 'classcat';
import { ParentComponent, Show } from 'solid-js';
import { ActionsMenu } from '../ActionsMenu';
import { MenuItem } from '../MenuButton';
import styles from './PanelListFormField.module.scss';
import { PanelListItem } from './PanelListItem';

type PanelListFormFieldProps = {
  actions?: MenuItem[];
  class?: string;
  description?: string;
  for: string;
  label: string;
};

export const PanelListFormField: ParentComponent<PanelListFormFieldProps> = props => {
  const t = useTranslate();

  return (
    <PanelListItem
      aria-label={props.label}
      class={cc([
        {
          [styles.panelListFormField]: true,
          [styles.hasActions]: !!props.actions,
        },
        props.class,
      ])}
    >
      <div class={styles.label}>
        <label for={props.for}>{props.label}</label>
        <Show when={props.description}>
          {getDescription => (
            <div class={styles.description} data-testid="form-field-description">
              {getDescription()}
            </div>
          )}
        </Show>
      </div>
      <div class={styles.content}>
        {props.children}
        <Show when={props.actions}>
          {getActions => (
            <ActionsMenu
              menuItems={getActions()}
              menuLabel={t('formFieldMoreOptionsMenuLabel')}
              tooltip={t('formFieldMoreOptionsTooltip')}
              triggerLabel={t('formFieldMoreOptionsTriggerLabel')}
            />
          )}
        </Show>
      </div>
    </PanelListItem>
  );
};
