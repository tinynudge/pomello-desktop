import { useDashboardSettings } from '@/dashboard/context/DashboardSettingsContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component } from 'solid-js';
import styles from './PomodoroSetSimpleInput.module.scss';

type PomodoroSetSimpleInputProps = {
  taskCount: number;
};

export const PomodoroSetSimpleInput: Component<PomodoroSetSimpleInputProps> = props => {
  const { stageSetting } = useDashboardSettings();
  const t = useTranslate();

  const handleSettingChange = (value: string) => {
    stageSetting('pomodoroSet', +value);
  };

  const options = Array.from({ length: 8 }).map((_, index) => ({
    id: (index + 1).toString(),
    label: (index + 1).toString(),
  }));

  return (
    <span class={styles.selectContainer}>
      <Select
        id="pomodoroSet"
        onChange={handleSettingChange}
        options={options}
        value={`${props.taskCount}`}
      />
      {t('pomodoroSetSimpleSelectSuffix')}
    </span>
  );
};
