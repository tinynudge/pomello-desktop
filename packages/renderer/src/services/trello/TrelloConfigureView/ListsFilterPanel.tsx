import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Input } from '@/ui/dashboard/Input';
import { Panel } from '@/ui/dashboard/Panel';
import { ToggleSwitch } from '@/ui/dashboard/ToggleSwitch';
import { Translate } from '@/ui/shared/Translate';
import { Component, JSX } from 'solid-js';
import { TrelloConfigStore } from '../domain';
import styles from './ListsFilterPanel.module.scss';

export const ListsFilterPanel: Component = () => {
  const { getServiceConfigValue, registerValidationField, stageServiceConfigValue } =
    useConfigureService<TrelloConfigStore>();
  const t = useTranslate();

  const { clearValidationError, getValidationError, setValidationError } =
    registerValidationField();

  const handleHelpClick = () => {
    window.app.openUrl(`${import.meta.env.VITE_APP_URL}/help#boards-and-lists`);
  };

  const handleListFilterInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    const { value } = event.currentTarget;

    if (value && !isValidFilter(value)) {
      setValidationError(t('service:invalidFilter'));
    } else {
      clearValidationError();
    }

    stageServiceConfigValue('listFilter', value);
  };

  const handleListFilterCaseSensitivityChange = (checked: boolean) => {
    stageServiceConfigValue('listFilterCaseSensitive', checked);
  };

  const isValidFilter = (filter: string) => {
    try {
      new RegExp(filter);

      return true;
    } catch {
      return false;
    }
  };

  return (
    <Panel
      heading={t('service:listsFilterHeading')}
      padding="none"
      subHeading={
        <Translate
          components={{
            help: props => (
              <Button onClick={handleHelpClick} variant="text">
                {props.children}
              </Button>
            ),
          }}
          key="service:listsFilterSubheading"
        />
      }
    >
      <Panel.List aria-label={t('service:listsFilterLabel')}>
        <Panel.List.FormField for="listFilter" label={t('service:listsFilterFilterLabel')}>
          <Input
            class={styles.listFilterInput}
            id="listFilter"
            message={getValidationError()}
            onInput={handleListFilterInput}
            value={getServiceConfigValue('listFilter') ?? ''}
          />
        </Panel.List.FormField>
        <Panel.List.FormField
          for="listFilterCaseSensitive"
          label={t('service:listsFilterCaseSensitiveLabel')}
        >
          <ToggleSwitch
            checked={getServiceConfigValue('listFilterCaseSensitive')}
            id="listFilterCaseSensitive"
            onChange={handleListFilterCaseSensitivityChange}
          />
        </Panel.List.FormField>
      </Panel.List>
    </Panel>
  );
};
