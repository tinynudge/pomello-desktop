import { useTranslate } from '@/shared/context/RuntimeContext';
import { Action } from '@/ui/dashboard/ActionsMenu';
import { Panel } from '@/ui/dashboard/Panel';
import { ParentComponent } from 'solid-js';
import { Setting } from './settingsByCategory';

type SettingsFieldProps = {
  additionalActions?: Action[];
  defaultValue: string;
  setting: Setting;
};

export const SettingsField: ParentComponent<SettingsFieldProps> = props => {
  const t = useTranslate();

  const handleRestoreDefaultClick = () => {
    window.app.updateSetting(props.setting.id, props.setting.default);
  };

  return (
    <Panel.List.FormField
      actions={[
        ...(props.additionalActions ?? []),
        {
          content: t('restoreDefault', { value: props.defaultValue }),
          onClick: handleRestoreDefaultClick,
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
