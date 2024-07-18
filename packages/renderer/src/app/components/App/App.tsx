import { useStore, useStoreActions } from '@/app/context/StoreContext';
import { AddNoteView } from '@/app/views/AddNoteView';
import { CreateTaskView } from '@/app/views/CreateTaskView';
import { SelectServiceView } from '@/app/views/SelectServiceView';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useServiceResource } from '@/shared/context/ServiceContext';
import { Content } from '@/ui/app/Content';
import { LoadingText } from '@/ui/app/LoadingText';
import cc from 'classcat';
import { Component, Match, Switch } from 'solid-js';
import { Layout } from '../Layout';
import { ServiceContainer } from '../ServiceContainer';
import { Views } from '../Views';
import styles from './App.module.scss';
import { useCheckPomelloAccount } from './useCheckPomelloAccount';
import { useEmitPomelloEvents } from './useEmitPomelloEvents';
import { useLogPomelloEvents } from './useLogPomelloEvents';
import { useLogTrackingEvents } from './useLogTrackingEvents';
import { useMonitorPowerChange } from './useMonitorPowerChange';
import { useOpenTask } from './useOpenTask';
import { useTimerSounds } from './useTimerSounds';
import { useWarnBeforeQuittingDialog } from './useWarnBeforeQuittingDialog';

export const App: Component = () => {
  const { overlayViewSet } = useStoreActions();
  const serviceResource = useServiceResource();
  const store = useStore();
  const t = useTranslate();

  useCheckPomelloAccount();
  useEmitPomelloEvents();
  useLogPomelloEvents();
  useLogTrackingEvents();
  useMonitorPowerChange();
  useOpenTask();
  useTimerSounds();
  useWarnBeforeQuittingDialog();

  const handleTaskCreate = () => {
    if (!serviceResource.loading && serviceResource.latest?.service.onTaskCreate) {
      overlayViewSet('create-task');
      return;
    }

    const message =
      !serviceResource.loading && serviceResource.latest
        ? t('serviceActionUnavailable', { service: serviceResource.latest.service.displayName })
        : serviceResource.loading
          ? t('createTaskNotReadyMessage')
          : t('createTaskNoServiceMessage');

    new Notification(t('createTaskDisabledHeading'), {
      body: message,
    });
  };

  return (
    <Layout onTaskCreate={handleTaskCreate}>
      <Switch fallback={<SelectServiceView />}>
        <Match when={serviceResource.state === 'ready' && serviceResource()}>
          {store.overlayView === 'create-task' ? (
            <CreateTaskView />
          ) : store.overlayView ? (
            <AddNoteView noteType={store.overlayView} />
          ) : null}
          <Content class={cc({ [styles.contentHidden]: Boolean(store.overlayView) })}>
            <ServiceContainer>
              <Views />
            </ServiceContainer>
          </Content>
        </Match>
        <Match when={serviceResource.loading}>
          <Content>
            <LoadingText />
          </Content>
        </Match>
      </Switch>
    </Layout>
  );
};
