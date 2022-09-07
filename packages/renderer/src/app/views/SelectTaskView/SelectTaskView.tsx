import { selectPomelloState } from '@/app/appSlice';
import getTasksCacheKey from '@/app/helpers/getTasksCacheKey';
import useDialActions from '@/app/hooks/useDialActions';
import usePauseDialAction from '@/app/hooks/usePauseDialAction';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import SelectField from '@/app/ui/SelectField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

const SelectTaskView: FC = () => {
  const { fetchTasks, id, SelectTaskView } = useService();
  const { t } = useTranslation();

  const { selectTask } = usePomelloActions();

  const { data: tasks } = useQuery(getTasksCacheKey(id), fetchTasks, {
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

  return !SelectTaskView ? (
    <SelectField
      items={tasks!}
      onChange={handleTaskSelect}
      placeholder={t('selectTaskPlaceholder')}
    />
  ) : (
    <SelectTaskView selectTask={selectTask} />
  );
};

export default SelectTaskView;
