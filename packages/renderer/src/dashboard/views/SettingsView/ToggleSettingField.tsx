import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { ToggleSwitch } from '@/ui/dashboard/ToggleSwitch';
import { Component } from 'solid-js';
import { SettingsField } from './SettingsField';
import { ToggleSetting } from './settingsByCategory';

type ToggleSettingFieldProps = {
  setting: ToggleSetting;
};

export const ToggleSettingField: Component<ToggleSettingFieldProps> = props => {
  const settings = useSettings();
  const t = useTranslate();

  const handleSettingChange = (checked: boolean) => {
    window.app.updateSetting(props.setting.id, checked);
  };

  return (
    <SettingsField
      defaultValue={t(`toggleDefault.${props.setting.default}`)}
      setting={props.setting}
    >
      <ToggleSwitch
        checked={settings[props.setting.id] as boolean | undefined}
        id={props.setting.id}
        onChange={handleSettingChange}
      />
    </SettingsField>
  );
};
