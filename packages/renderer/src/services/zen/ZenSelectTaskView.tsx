import { useUpdateTasks } from '@/app/hooks/useUpdateTasks';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { InputField } from '@/ui/app/InputField';
import { SelectTaskView } from '@pomello-desktop/domain';
import { JSX, createSignal, onMount } from 'solid-js';

export const ZenSelectTaskView: SelectTaskView = props => {
  const t = useTranslate();
  const updateTasks = useUpdateTasks();

  const [getTask, setTask] = createSignal('');

  onMount(() => {
    inputRef.focus();
  });

  const handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setTask(event.currentTarget.value);
  };

  const handleInputSubmit = () => {
    const task = getTask();

    updateTasks(() => [{ id: task, label: task }]);

    props.selectTask(task);
  };

  let inputRef!: HTMLInputElement;

  return (
    <InputField
      onInput={handleInputChange}
      onSubmit={handleInputSubmit}
      placeholder={t('service:selectTaskPlaceholder')}
      ref={inputRef}
    />
  );
};
