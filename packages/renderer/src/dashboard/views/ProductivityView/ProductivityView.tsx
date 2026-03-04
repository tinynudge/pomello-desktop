import { MainHeader } from '@/dashboard/components/MainHeader';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Component, Show } from 'solid-js';
import { ExportModal } from './ExportModal';
import { LoginView } from './LoginView';
import { TaskNameHelpersProvider } from './TaskNameHelpersContext';
import { TodayPanel } from './TodayPanel';
import { WeeklyProductivityPanels } from './WeeklyProductivityPanels';

export const ProductivityView: Component = () => {
  const pomelloConfig = usePomelloConfig();
  const t = useTranslate();

  const handleExportClick = () => {
    exportModalRef.showModal();
  };

  let exportModalRef!: HTMLDialogElement;

  return (
    <Show when={pomelloConfig.store.user} fallback={<LoginView />}>
      <TaskNameHelpersProvider>
        <MainHeader heading={t('routeProductivity')}>
          <Button onClick={handleExportClick}>{t('exportData')}</Button>
        </MainHeader>
        <TodayPanel />
        <WeeklyProductivityPanels />
        <ExportModal ref={exportModalRef} />
      </TaskNameHelpersProvider>
    </Show>
  );
};
