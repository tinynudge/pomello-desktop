import { selectPomelloState } from '@/app/appSlice';
import getTasksCacheKey from '@/app/helpers/getTasksCacheKey';
import useDialActions from '@/app/hooks/useDialActions';
import usePauseDialAction from '@/app/hooks/usePauseDialAction';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

interface SelectTaskViewProps {
  fetchTasks(): Promise<SelectItem[]>;
  serviceId: string;
}

const SelectTaskView: FC<SelectTaskViewProps> = ({ fetchTasks, serviceId }) => {
  const { t } = useTranslation();

  const { selectTask } = usePomelloActions();

  const { data: tasks } = useQuery(getTasksCacheKey(serviceId), fetchTasks, {
    cacheTime: Infinity,
  });

  const { timer } = useSelector(selectPomelloState);
  const { registerDialActions } = useDialActions();
  const pauseDialAction = usePauseDialAction();

  useEffect(() => {
    if (timer?.isActive) {
      return registerDialActions([pauseDialAction]);
    }
  }, [pauseDialAction, registerDialActions, timer?.isActive]);

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
