import usePomelloActions from '@/app/hooks/usePomelloActions';
import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC } from 'react';
import { useQuery } from 'react-query';

interface SelectTaskViewProps {
  fetchTasks(): Promise<SelectItem[]>;
  serviceId: string;
}

const SelectTaskView: FC<SelectTaskViewProps> = ({ fetchTasks, serviceId }) => {
  const { t } = useTranslation();

  const { selectTask } = usePomelloActions();

  const { data: tasks } = useQuery(`${serviceId}-tasks`, fetchTasks);

  const handleTaskSelect = (id: string) => {
    selectTask(id);
  };

  return (
    <SelectField
      items={tasks!}
      onChange={handleTaskSelect}
      placeholder={t('selectTaskPlaceholder')}
    />
  );
};

export default SelectTaskView;
