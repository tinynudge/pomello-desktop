import useUpdateTasks from '@/app/hooks/useUpdateTasks';
import InputField from '@/app/ui/InputField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectTaskView } from '@domain';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

const ZenSelectTaskView: SelectTaskView = ({ selectTask }) => {
  const { t } = useTranslation();
  const updateTasks = useUpdateTasks();

  const [task, setTask] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTask(event.currentTarget.value);
  };

  const handleInputSubmit = () => {
    updateTasks(() => [{ id: task, label: task }]);

    selectTask(task);
  };

  return (
    <InputField
      onChange={handleInputChange}
      onSubmit={handleInputSubmit}
      placeholder={t('service:selectTaskPlaceholder')}
      ref={inputRef}
    />
  );
};

export default ZenSelectTaskView;
