import { useTranslate } from '@/shared/context/RuntimeContext';
import cc from 'classcat';
import { nanoid } from 'nanoid';
import { createSignal, JSX, ParentComponent, Show } from 'solid-js';
import { ActionsMenu } from '../ActionsMenu';
import { MenuItem } from '../MenuButton';
import styles from './PanelAccordionItem.module.scss';
import CaretIcon from './assets/caret.svg';

type PanelAccordionItemProps = {
  actions?: MenuItem[];
  isPaddingDisabled?: boolean;
  title: string;
  titleExtras?: JSX.Element;
};

export const PanelAccordionItem: ParentComponent<PanelAccordionItemProps> = props => {
  const t = useTranslate();

  const [getIsHidden, setIsHidden] = createSignal(true);

  const handleTitleClick = () => {
    setIsHidden(previousIsHidden => !previousIsHidden);
  };

  const buttonId = `accordion-button-${nanoid()}`;
  const panelId = `accordion-panel-${nanoid()}`;

  return (
    <>
      <h3
        aria-labelledby={buttonId}
        class={cc({
          [styles.hasActions]: !!props.actions,
          [styles.hasExtras]: !!props.titleExtras,
          [styles.panelAccordionItem]: true,
        })}
      >
        <button
          aria-controls={panelId}
          aria-expanded={!getIsHidden()}
          class={styles.button}
          id={buttonId}
          onClick={handleTitleClick}
        >
          {props.title}
          <CaretIcon class={styles.caret} />
        </button>
        <Show when={props.titleExtras || props.actions}>
          <div class={styles.actions}>
            {props.titleExtras}
            <Show when={props.actions}>
              {getActions => (
                <ActionsMenu
                  menuItems={getActions()}
                  menuLabel={t('panelMoreOptionsMenuLabel')}
                  tooltip={t('panelMoreOptionsTooltip')}
                />
              )}
            </Show>
          </div>
        </Show>
      </h3>
      <div
        aria-labelledby={buttonId}
        class={cc({
          [styles.content]: true,
          [styles.isPaddingDisabled]: props.isPaddingDisabled,
        })}
        hidden={getIsHidden()}
        id={panelId}
        role="region"
      >
        {props.children}
      </div>
    </>
  );
};
