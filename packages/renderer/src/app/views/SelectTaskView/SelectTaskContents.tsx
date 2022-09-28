import { selectIsTimerActive } from '@/app/appSlice';
import getTasksCacheKey from '@/app/helpers/getTasksCacheKey';
import useDialActions from '@/app/hooks/useDialActions';
import usePauseDialAction from '@/app/hooks/usePauseDialAction';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import assertNonNullish from '@/shared/helpers/assertNonNullish';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

const SelectTaskContents: FC = () => {
  const { fetchTasks, getSelectTaskHeading, id, SelectTaskView } = useService();
  const { t } = useTranslation();

  const { selectTask } = usePomelloActions();

  const { data: tasks } = useQuery(getTasksCacheKey(id), fetchTasks, {
    cacheTime: Infinity,
    suspense: true,
  });

  const isTimerActive = useSelector(selectIsTimerActive);
  const { registerDialActions } = useDialActions();
  const pauseDialAction = usePauseDialAction();

  useEffect(() => {
    if (isTimerActive) {
      return registerDialActions([pauseDialAction]);
    }
  }, [isTimerActive, pauseDialAction, registerDialActions]);

  assertNonNullish(tasks, 'Unable to get tasks');

  const handleTaskSelect = (id: string) => {
    selectTask(id);
  };

  return !SelectTaskView ? (
    <>
      {getSelectTaskHeading && <Heading>{getSelectTaskHeading()}</Heading>}
      <SelectField
        defaultOpen={isTimerActive}
        items={tasks}
        onChange={handleTaskSelect}
        placeholder={t('selectTaskPlaceholder')}
      />
    </>
  ) : (
    <SelectTaskView selectTask={selectTask} />
  );
};

export default SelectTaskContents;
