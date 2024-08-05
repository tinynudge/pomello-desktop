import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component, createMemo } from 'solid-js';
import { SettingsField } from './SettingsField';
import styles from './TimeSettingField.module.scss';
import { TimeSetting } from './settingsByCategory';

type TimeSettingFieldProps = {
  setting: TimeSetting;
};

export const TimeSettingField: Component<TimeSettingFieldProps> = props => {
  const settings = useSettings();
  const t = useTranslate();

  const getOptions = createMemo(() => {
    const length = props.setting.max - props.setting.min + 1;

    return Array.from({ length }).map((_, index) => ({
      id: `${(props.setting.min + index) * 60}`,
      label: `${props.setting.min + index}`,
    }));
  });

  const handleSettingChange = (value: string) => {
    window.app.updateSetting(props.setting.id, +value);
  };

  return (
    <SettingsField
      defaultValue={t('timeLength', { count: `${+props.setting.default / 60}` })}
      setting={props.setting}
    >
      <span class={styles.select}>
        <Select
          id={props.setting.id}
          onChange={handleSettingChange}
          options={getOptions()}
          value={settings[props.setting.id]?.toString()}
        />
        {t('timeSelectSuffix')}
      </span>
    </SettingsField>
  );
};
