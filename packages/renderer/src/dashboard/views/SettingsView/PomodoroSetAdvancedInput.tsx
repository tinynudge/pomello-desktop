import { useTranslate } from '@/shared/context/RuntimeContext';
import { MenuButton, MenuItem } from '@/ui/dashboard/MenuButton';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { SetItem } from '@tinynudge/pomello-service';
import { Component, Index } from 'solid-js';
import styles from './PomodoroSetAdvancedInput.module.scss';
import AddIcon from './assets/add.svg';

type PomodoroSetAdvancedInputProps = {
  setItems: SetItem[];
};

export const PomodoroSetAdvancedInput: Component<PomodoroSetAdvancedInputProps> = props => {
  const t = useTranslate();

  const handleSwitchTimerClick = (setItem: SetItem, index: number) => {
    const updatedPomodoroSet = props.setItems.toSpliced(index, 1, setItem);

    window.app.updateSetting('pomodoroSet', updatedPomodoroSet);
  };

  const handleRemoveTimerClick = (index: number) => {
    const updatedPomodoroSet = props.setItems.toSpliced(index, 1);

    window.app.updateSetting('pomodoroSet', updatedPomodoroSet);
  };

  const handleAddTimerClick = (setItem: SetItem) => {
    window.app.updateSetting('pomodoroSet', [...props.setItems, setItem]);
  };

  const createEditTimerOptions = (setItem: SetItem, index: number) => {
    const options: MenuItem[] = [];

    if (setItem !== 'task') {
      options.push({
        onClick: () => handleSwitchTimerClick('task', index),
        text: t('switchToTaskTimer'),
      });
    }

    if (setItem !== 'shortBreak') {
      options.push({
        onClick: () => handleSwitchTimerClick('shortBreak', index),
        text: t('switchToShortBreakTimer'),
      });
    }

    if (setItem !== 'longBreak') {
      options.push({
        onClick: () => handleSwitchTimerClick('longBreak', index),
        text: t('switchToLongBreakTimer'),
      });
    }

    options.push({
      onClick: () => handleRemoveTimerClick(index),
      text: t('removeTimer'),
    });

    return options;
  };

  return (
    <div class={styles.pomodoroSetAdvancedInput}>
      <Index each={props.setItems}>
        {(getSetItem, index) => (
          <Tooltip text={t(`${getSetItem()}TimerTooltip`, { count: `${index + 1}` })}>
            {tooltipTargetRef => (
              <MenuButton
                aria-label={t(`${getSetItem()}TimerTooltip`, { count: `${index + 1}` })}
                class={styles.button}
                menuItems={createEditTimerOptions(getSetItem(), index)}
                ref={tooltipTargetRef}
              >
                <div class={styles.timerIcon} data-timer={getSetItem()} />
              </MenuButton>
            )}
          </Tooltip>
        )}
      </Index>
      <Tooltip text={t('addTimerTooltip')}>
        {tooltipTargetRef => (
          <MenuButton
            aria-label={t('addTimerTooltip')}
            class={styles.button}
            menuItems={[
              {
                onClick: () => handleAddTimerClick('task'),
                text: t('addTaskTimer'),
              },
              {
                onClick: () => handleAddTimerClick('shortBreak'),
                text: t('addShortBreakTimer'),
              },
              {
                onClick: () => handleAddTimerClick('longBreak'),
                text: t('addLongBreakTimer'),
              },
            ]}
            ref={tooltipTargetRef}
          >
            <AddIcon class={styles.addIcon} />
          </MenuButton>
        )}
      </Tooltip>
    </div>
  );
};
