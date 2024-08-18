import { useDashboardSettings } from '@/dashboard/context/DashboardSettingsContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { Component, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { SettingsField } from './SettingsField';
import { TimeSettingAdvancedInput } from './TimeSettingAdvancedInput';
import { TimeSettingSimpleInput } from './TimeSettingSimpleInput';
import { TimeSetting } from './settingsByCategory';

type TimeSettingFieldProps = {
  setting: TimeSetting;
};

export const TimeSettingField: Component<TimeSettingFieldProps> = props => {
  const { getSetting, stageSetting, onStagedSettingsClear } = useDashboardSettings();
  const t = useTranslate();

  const getValue = () => getSetting(props.setting.id) as number;

  const isSimpleViewCompatible = (value: number) =>
    value >= 60 && value <= props.setting.max * 60 && value % 60 === 0;

  const [getView, setView] = createSignal<'advanced' | 'simple'>(
    isSimpleViewCompatible(getValue()) ? 'simple' : 'advanced'
  );

  onMount(() => {
    const unsubscribeOnSettingsClear = onStagedSettingsClear(() => {
      if (previousView) {
        setView(previousView);

        previousView = null;
      }
    });

    onCleanup(unsubscribeOnSettingsClear);
  });

  const handleViewChange = () => {
    const currentView = getView();

    if (!previousView) {
      previousView = currentView;
    }

    if (currentView === 'advanced') {
      if (!isSimpleViewCompatible(getValue())) {
        incompatibleSettingModalRef.showModal();
        return;
      }

      setView('simple');
    } else {
      setView('advanced');
    }
  };

  const handleResetClick = () => {
    stageSetting(props.setting.id, props.setting.default);

    setView('simple');
  };

  const handleSettingChange = (value: number) => {
    stageSetting(props.setting.id, value);
  };

  let previousView: 'advanced' | 'simple' | null = null;

  let incompatibleSettingModalRef: HTMLDialogElement;

  return (
    <SettingsField
      additionalActions={[
        {
          onClick: handleViewChange,
          text:
            getView() === 'advanced' ? t('switchSimpleViewAction') : t('switchAdvancedViewAction'),
        },
      ]}
      defaultValue={t('timeLength', { count: `${+props.setting.default / 60}` })}
      setting={props.setting}
    >
      <Show
        when={getView() === 'simple'}
        fallback={
          <TimeSettingAdvancedInput
            id={props.setting.id}
            onSettingChange={handleSettingChange}
            value={getValue()}
          />
        }
      >
        <TimeSettingSimpleInput
          onSettingChange={handleSettingChange}
          setting={props.setting}
          value={getValue()}
        />
      </Show>
      <Modal
        buttons={[
          { children: t('reset'), onClick: handleResetClick, variant: 'primary' },
          { children: t('cancel'), autofocus: true },
        ]}
        heading={t('incompatibleSetting')}
        ref={incompatibleSettingModalRef!}
      >
        <p>{t('incompatibleTime')}</p>
      </Modal>
    </SettingsField>
  );
};
