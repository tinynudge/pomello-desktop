import { useTranslate } from '@/shared/context/RuntimeContext';
import { Select } from '@/ui/dashboard/Select';
import { Component, createMemo } from 'solid-js';
import styles from './TimeSettingSimpleInput.module.scss';
import { TimeSetting } from './settingsByCategory';

type TimeSettingSimpleInputProps = {
  setting: TimeSetting;
  onSettingChange(value: number): void;
  value: number;
};

export const TimeSettingSimpleInput: Component<TimeSettingSimpleInputProps> = props => {
  const t = useTranslate();

  const getOptions = createMemo(() => {
    const length = props.setting.max - props.setting.min + 1;

    return Array.from({ length }).map((_, index) => ({
      id: `${(props.setting.min + index) * 60}`,
      label: `${props.setting.min + index}`,
    }));
  });

  const handleSettingChange = (value: string) => {
    props.onSettingChange(+value);
  };

  return (
    <span class={styles.timeSettingSimpleInput}>
      <Select
        id={props.setting.id}
        onChange={handleSettingChange}
        options={getOptions()}
        value={`${props.value}`}
      />
      {t('timeSelectMinSuffix')}
    </span>
  );
};
