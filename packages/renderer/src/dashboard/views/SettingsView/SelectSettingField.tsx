import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component, createMemo } from 'solid-js';
import { SettingsField } from './SettingsField';
import { SelectSetting } from './settingsByCategory';

type SelectSettingFieldProps = {
  setting: SelectSetting;
};

export const SelectSettingField: Component<SelectSettingFieldProps> = props => {
  const settings = useSettings();
  const t = useTranslate();

  const getOptions = createMemo(() =>
    props.setting.options.map(id => ({
      id,
      label: t(`settings.${props.setting.id}.option.${id}`),
    }))
  );

  const handleSettingChange = (value: string) => {
    window.app.updateSetting(props.setting.id, value);
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
        value={settings[props.setting.id] as string | undefined}
      />
    </SettingsField>
  );
};
