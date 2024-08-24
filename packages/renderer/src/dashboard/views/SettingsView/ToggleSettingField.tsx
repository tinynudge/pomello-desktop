import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { ToggleSwitch } from '@/ui/dashboard/ToggleSwitch';
import { Component } from 'solid-js';
import { SettingsField } from './SettingsField';
import { ToggleSetting } from './settingsByCategory';

type ToggleSettingFieldProps = {
  setting: ToggleSetting;
};

export const ToggleSettingField: Component<ToggleSettingFieldProps> = props => {
  const { getSetting, stageSetting } = useDashboard();
  const t = useTranslate();

  const handleSettingChange = (checked: boolean) => {
    stageSetting(props.setting.id, checked);
  };

  return (
    <SettingsField
      defaultValue={t(`toggleDefault.${props.setting.default}`)}
      setting={props.setting}
    >
      <ToggleSwitch
        checked={getSetting(props.setting.id) as boolean | undefined}
        id={props.setting.id}
        onChange={handleSettingChange}
      />
    </SettingsField>
  );
};
