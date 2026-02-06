import { MainHeader } from '@/dashboard/components/MainHeader';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Component, Show } from 'solid-js';
import { LoginView } from './LoginView';
import { TodayPanel } from './TodayPanel';
import { WeeklyProductivityPanels } from './WeeklyProductivityPanels';

export const ProductivityView: Component = () => {
  const pomelloConfig = usePomelloConfig();
  const t = useTranslate();

  return (
    <Show when={pomelloConfig.store.user} fallback={<LoginView />}>
      <MainHeader heading={t('routeProductivity')}>
        <Button>{t('exportData')}</Button>
      </MainHeader>
      <TodayPanel />
      <WeeklyProductivityPanels />
    </Show>
  );
};
