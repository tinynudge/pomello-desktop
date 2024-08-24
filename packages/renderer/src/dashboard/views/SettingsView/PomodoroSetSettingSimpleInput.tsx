import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component } from 'solid-js';
import styles from './PomodoroSetSettingSimpleInput.module.scss';

type PomodoroSetSettingSimpleInputProps = {
  taskCount: number;
};

export const PomodoroSetSettingSimpleInput: Component<
  PomodoroSetSettingSimpleInputProps
> = props => {
  const { stageSetting } = useDashboard();
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
