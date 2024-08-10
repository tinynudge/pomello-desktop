import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { Select } from '@/ui/dashboard/Select';
import { SetItem } from '@tinynudge/pomello-service';
import { Component, Match, Switch } from 'solid-js';
import { PomodoroSetAdvancedInput } from './PomodoroSetAdvancedInput';
import styles from './PomodoroSetSettingField.module.scss';
import { SettingsField } from './SettingsField';
import { PomodoroSetSetting } from './settingsByCategory';

type PomodoroSetSettingFieldProps = {
  setting: PomodoroSetSetting;
};

const hasSetItems = (pomodoroSet: number | SetItem[]): pomodoroSet is SetItem[] => {
  return Array.isArray(pomodoroSet);
};

export const PomodoroSetSettingField: Component<PomodoroSetSettingFieldProps> = props => {
  const settings = useSettings();
  const t = useTranslate();

  const handleViewChange = () => {
    if (hasSetItems(settings.pomodoroSet)) {
      let count = 0;

      const isSimpleCountCompatible = settings.pomodoroSet.toReversed().every((setItem, index) => {
        if (setItem === 'task') {
          count += 1;
        }

        // A long break must be the last item in the set.
        // We check the zero index because we reversed the array.
        // Tasks must be on odd indexes
        // Everything else has to be a short break.
        return index === 0
          ? setItem === 'longBreak'
          : index % 2
            ? setItem === 'task'
            : setItem === 'shortBreak';
      });

      if (!isSimpleCountCompatible) {
        incompatibleSettingModalRef.showModal();
        return;
      }

      window.app.updateSetting('pomodoroSet', count);
    } else {
      const length = settings.pomodoroSet - 1;

      const updatedPomodoroSet = Array.from({ length })
        .flatMap<SetItem>(() => ['task', 'shortBreak'])
        .concat('task', 'longBreak');

      window.app.updateSetting('pomodoroSet', updatedPomodoroSet);
    }
  };

  const handleResetClick = () => {
    window.app.updateSetting('pomodoroSet', props.setting.default);
  };

  const handleSettingChange = (value: string) => {
    window.app.updateSetting(props.setting.id, +value);
  };

  const simpleOptions = Array.from({ length: 8 }).map((_, index) => ({
    id: (index + 1).toString(),
    label: (index + 1).toString(),
  }));

  let incompatibleSettingModalRef: HTMLDialogElement;

  return (
    <SettingsField
      additionalActions={[
        {
          onClick: handleViewChange,
          text: hasSetItems(settings.pomodoroSet)
            ? t('switchSimpleViewAction')
            : t('switchAdvancedViewAction'),
        },
      ]}
      defaultValue={props.setting.default.toString()}
      setting={props.setting}
    >
      <Switch>
        <Match when={!hasSetItems(settings.pomodoroSet) && settings.pomodoroSet}>
          {getPomodoroSet => (
            <span class={styles.selectContainer}>
              <Select
                id={props.setting.id}
                onChange={handleSettingChange}
                options={simpleOptions}
                value={getPomodoroSet().toString()}
              />
              {t('pomodoroSetSimpleSelectSuffix')}
            </span>
          )}
        </Match>
        <Match when={hasSetItems(settings.pomodoroSet) && settings.pomodoroSet}>
          {getSetItems => <PomodoroSetAdvancedInput setItems={getSetItems()} />}
        </Match>
      </Switch>
      <Modal
        buttons={[
          { children: t('reset'), onClick: handleResetClick, variant: 'primary' },
          { children: t('cancel'), autofocus: true },
        ]}
        heading={t('incompatibleSetting')}
        ref={incompatibleSettingModalRef!}
      >
        <p>{t('incompatiblePomodoroSet')}</p>
      </Modal>
    </SettingsField>
  );
};
