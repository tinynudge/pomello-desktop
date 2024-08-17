import { useDashboardSettings } from '@/dashboard/context/DashboardSettingsContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component, createMemo } from 'solid-js';
import { SettingsField } from './SettingsField';
import styles from './TimeSettingField.module.scss';
import { TimeSetting } from './settingsByCategory';

type TimeSettingFieldProps = {
  setting: TimeSetting;
};

export const TimeSettingField: Component<TimeSettingFieldProps> = props => {
  const { getSetting, stageSetting } = useDashboardSettings();
  const t = useTranslate();

  const getOptions = createMemo(() => {
    const length = props.setting.max - props.setting.min + 1;

    return Array.from({ length }).map((_, index) => ({
      id: `${(props.setting.min + index) * 60}`,
      label: `${props.setting.min + index}`,
    }));
  });

  const handleSettingChange = (value: string) => {
    stageSetting(props.setting.id, +value);
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
          value={getSetting(props.setting.id)?.toString()}
        />
        {t('timeSelectSuffix')}
      </span>
    </SettingsField>
  );
};
