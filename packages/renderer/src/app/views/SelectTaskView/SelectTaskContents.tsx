import {
  dialActionsSet,
  dialActionsUnset,
  quickTaskSelectDisabled,
  selectIsQuickTaskSelectEnabled,
  selectIsTimerActive,
} from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTasksCacheKey from '@/app/hooks/useTasksCacheKey';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import assertNonNullish from '@/shared/helpers/assertNonNullish';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

const SelectTaskContents: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { fetchTasks, getSelectTaskHeading, onTaskSelect, SelectTaskView } = useService();
  const { selectTask } = usePomelloActions();

  const tasksCacheKey = useTasksCacheKey();
  const { data: tasks } = useQuery(tasksCacheKey, fetchTasks, {
    cacheTime: Infinity,
    suspense: true,
  });

  const isTimerActive = useSelector(selectIsTimerActive);

  const isQuickTaskSelectEnabled = useSelector(selectIsQuickTaskSelectEnabled);
  const isQuickTaskSelectEnabledRef = useRef(isQuickTaskSelectEnabled);

  useEffect(() => {
    if (isQuickTaskSelectEnabled) {
      dispatch(quickTaskSelectDisabled());
    }
  }, [dispatch, isQuickTaskSelectEnabled]);

  useEffect(() => {
    if (isTimerActive) {
      dispatch(dialActionsSet(['pauseTimer']));
    }

    return () => {
      dispatch(dialActionsUnset());
    };
  }, [dispatch, isTimerActive]);

  assertNonNullish(tasks, 'Unable to get tasks');

  const handleTaskSelect = (id: string) => {
    const response = onTaskSelect?.(id);

    if (response !== false) {
      selectTask(id);
    }
  };

  return !SelectTaskView ? (
    <>
      {getSelectTaskHeading && <Heading>{getSelectTaskHeading()}</Heading>}
      <SelectField
        defaultOpen={isTimerActive || isQuickTaskSelectEnabledRef.current}
        items={tasks}
        noResultsMessage={t('noTasksFound')}
        onChange={handleTaskSelect}
        placeholder={t('selectTaskPlaceholder')}
      />
    </>
  ) : (
    <SelectTaskView selectTask={selectTask} />
  );
};

export default SelectTaskContents;
