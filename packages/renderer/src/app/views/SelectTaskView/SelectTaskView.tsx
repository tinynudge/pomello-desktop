import usePomelloActions from '@/app/hooks/usePomelloActions';
import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { Service } from '@domain';
import { FC } from 'react';
import { useQuery } from 'react-query';

interface SelectTaskViewProps {
  service: Service;
}

const SelectTaskView: FC<SelectTaskViewProps> = ({ service }) => {
  const { t } = useTranslation();

  const { selectTask } = usePomelloActions();

  const { data: tasks } = useQuery(`${service.id}-tasks`, service.fetchTasks);

  const handleTaskSelect = (id: string) => {
    selectTask(id);
  };

  return (
    <>
      <SelectField
        items={tasks!}
        onChange={handleTaskSelect}
        placeholder={t('selectTaskPlaceholder')}
      />
    </>
  );
};

export default SelectTaskView;
