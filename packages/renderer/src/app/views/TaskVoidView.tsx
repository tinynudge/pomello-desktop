import { useService } from '@/shared/context/ServiceContext';
import { Component, createEffect } from 'solid-js';
import { usePomelloActions } from '../context/PomelloContext';
import { useStore, useStoreActions } from '../context/StoreContext';

export const TaskVoidView: Component = () => {
  const { overlayViewSet } = useStoreActions();
  const { voidPromptHandled } = usePomelloActions();
  const getService = useService();
  const store = useStore();

  let didShowAddNoteView = false;

  createEffect(() => {
    if (!store.overlayView && didShowAddNoteView) {
      voidPromptHandled();
    }
  });

  if (!getService().onNoteCreate) {
    voidPromptHandled();
  } else {
    overlayViewSet('externalDistraction');

    didShowAddNoteView = true;
  }

  return null;
};
