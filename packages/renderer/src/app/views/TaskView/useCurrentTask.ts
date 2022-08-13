import { selectPomelloState } from '@/app/appSlice';
import getTasksCacheKey from '@/app/helpers/getTasksCacheKey';
import useService from '@/shared/hooks/useService';
import { SelectOptionType } from '@domain';
import { useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

const useCurrentTask = (): SelectOptionType => {
  const { id } = useService();

  const queryClient = useQueryClient();
  const tasks = queryClient.getQueryData<SelectOptionType[]>(getTasksCacheKey(id));

  const { currentTaskId } = useSelector(selectPomelloState);

  const currentTask = useMemo(() => {
    if (tasks) {
      return tasks.find(item => item.id === currentTaskId);
    }
  }, [tasks, currentTaskId]);

  if (!currentTask) {
    throw new Error(`Unable to find task with id "${currentTask}"`);
  }

  return currentTask;
};

export default useCurrentTask;
