import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { MenuItem } from '@/ui/dashboard/MenuButton';
import { Panel } from '@/ui/dashboard/Panel';
import { ParentComponent } from 'solid-js';
import { Setting } from './settingsByCategory';

type SettingsFieldProps = {
  additionalActions?: MenuItem[];
  defaultValue: string;
  setting: Setting;
};

export const SettingsField: ParentComponent<SettingsFieldProps> = props => {
  const { stageSetting } = useDashboard();
  const t = useTranslate();

  const handleRestoreDefaultClick = () => {
    stageSetting(props.setting.id, props.setting.default);
  };

  return (
    <Panel.List.FormField
      actions={[
        ...(props.additionalActions ?? []),
        {
          onClick: handleRestoreDefaultClick,
          text: t('restoreDefault', { value: props.defaultValue }),
        },
      ]}
      description={t(`settings.${props.setting.id}.description`)}
      for={props.setting.id}
      label={t(`settings.${props.setting.id}.label`)}
    >
      {props.children}
    </Panel.List.FormField>
  );
};
