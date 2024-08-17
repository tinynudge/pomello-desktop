import { useDashboardSettings } from '@/dashboard/context/DashboardSettingsContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { SetItem } from '@tinynudge/pomello-service';
import { Component, Match, Switch } from 'solid-js';
import { PomodoroSetAdvancedInput } from './PomodoroSetAdvancedInput';
import { PomodoroSetSimpleInput } from './PomodoroSetSimpleInput';
import { SettingsField } from './SettingsField';
import { PomodoroSetSetting } from './settingsByCategory';

type PomodoroSetSettingFieldProps = {
  setting: PomodoroSetSetting;
};

const hasSetItems = (pomodoroSet: number | SetItem[]): pomodoroSet is SetItem[] => {
  return Array.isArray(pomodoroSet);
};

export const PomodoroSetSettingField: Component<PomodoroSetSettingFieldProps> = props => {
  const { getSetting, stageSetting } = useDashboardSettings();
  const t = useTranslate();

  const handleViewChange = () => {
    const pomodoroSet = getSetting('pomodoroSet');

    if (hasSetItems(pomodoroSet)) {
      let count = 0;

      const isTaskCountCompatible = pomodoroSet.toReversed().every((setItem, index) => {
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

      if (!isTaskCountCompatible) {
        incompatibleSettingModalRef.showModal();
        return;
      }

      stageSetting('pomodoroSet', count);
    } else {
      const updatedPomodoroSet = Array.from({ length: pomodoroSet - 1 })
        .flatMap<SetItem>(() => ['task', 'shortBreak'])
        .concat('task', 'longBreak');

      stageSetting('pomodoroSet', updatedPomodoroSet);
    }
  };

  const handleResetClick = () => {
    stageSetting('pomodoroSet', props.setting.default);
  };

  const getMaybeSetItems = () => {
    const pomodoroSet = getSetting('pomodoroSet');

    return hasSetItems(pomodoroSet) ? pomodoroSet : null;
  };

  const getMaybeTaskCount = () => {
    const pomodoroSet = getSetting('pomodoroSet');

    return !hasSetItems(pomodoroSet) ? pomodoroSet : null;
  };

  let incompatibleSettingModalRef: HTMLDialogElement;

  return (
    <SettingsField
      additionalActions={[
        {
          onClick: handleViewChange,
          text: getMaybeSetItems() ? t('switchSimpleViewAction') : t('switchAdvancedViewAction'),
        },
      ]}
      defaultValue={props.setting.default.toString()}
      setting={props.setting}
    >
      <Switch>
        <Match when={getMaybeTaskCount()}>
          {getTaskCount => <PomodoroSetSimpleInput taskCount={getTaskCount()} />}
        </Match>
        <Match when={getMaybeSetItems()}>
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
