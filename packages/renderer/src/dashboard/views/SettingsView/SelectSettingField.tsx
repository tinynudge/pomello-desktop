import { useDashboardSettings } from '@/dashboard/context/DashboardSettingsContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component, createMemo } from 'solid-js';
import { SettingsField } from './SettingsField';
import { SelectSetting } from './settingsByCategory';

type SelectSettingFieldProps = {
  setting: SelectSetting;
};

export const SelectSettingField: Component<SelectSettingFieldProps> = props => {
  const { getSetting, stageSetting } = useDashboardSettings();
  const t = useTranslate();

  const getOptions = createMemo(() =>
    props.setting.options.map(id => ({
      id,
      label: t(`settings.${props.setting.id}.option.${id}`),
    }))
  );

  const handleSettingChange = (value: string) => {
    stageSetting(props.setting.id, value);
  };

  return (
    <SettingsField
      defaultValue={t(`settings.${props.setting.id}.option.${props.setting.default}`)}
      setting={props.setting}
    >
      <Select
        id={props.setting.id}
        onChange={handleSettingChange}
        options={getOptions()}
        value={getSetting(props.setting.id) as string | undefined}
      />
    </SettingsField>
  );
};
