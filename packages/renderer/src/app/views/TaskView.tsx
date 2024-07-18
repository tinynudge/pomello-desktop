import { useService } from '@/shared/context/ServiceContext';
import { Heading } from '@/ui/app/Heading';
import { Text } from '@/ui/app/Text';
import { Component, Show } from 'solid-js';
import { useStoreActions } from '../context/StoreContext';
import { useCurrentTask } from '../hooks/useCurrentTask';

export const TaskView: Component = () => {
  const { dialActionsSet } = useStoreActions();
  const getService = useService();

  const currentTask = useCurrentTask();

  dialActionsSet(['pauseTimer', 'addNote', 'switchTask', 'voidTask', 'completeTask']);

  return (
    <>
      <Show when={getService().getTaskHeading?.()}>
        {getTaskHeading => <Heading>{getTaskHeading()}</Heading>}
      </Show>
      <Text>{currentTask().label}</Text>
    </>
  );
};
