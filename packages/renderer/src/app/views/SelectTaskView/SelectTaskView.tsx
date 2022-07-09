import usePomelloActions from '@/app/hooks/usePomelloActions';
import SelectField from '@/app/ui/SelectField';
import { Service } from '@domain';
import { FC } from 'react';
import { useQuery } from 'react-query';

interface SelectTaskViewProps {
  service: Service;
}

const SelectTaskView: FC<SelectTaskViewProps> = ({ service }) => {
  const { selectTask } = usePomelloActions();

  const { data: tasks } = useQuery(`${service.id}-tasks`, service.fetchTasks);

  const handleTaskSelect = (id: string) => {
    selectTask(id);
  };

  return (
    <div>
      Select Task View
      <SelectField items={tasks!} onChange={handleTaskSelect} />
    </div>
  );
};

export default SelectTaskView;
