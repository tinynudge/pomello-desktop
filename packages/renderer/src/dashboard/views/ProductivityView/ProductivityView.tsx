import { MainHeader } from '@/dashboard/components/MainHeader';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { format, startOfWeek } from 'date-fns';
import { Component, Show } from 'solid-js';
import { LoginView } from './LoginView';

export const ProductivityView: Component = () => {
  const pomelloConfig = usePomelloConfig();
  const t = useTranslate();

  return (
    <Show when={pomelloConfig.store.user} fallback={<LoginView />}>
      <MainHeader heading={t('routeProductivity')}>
        <Button>Export data</Button>
      </MainHeader>
      <Panel heading={t('todayLabel')} />
      <Panel heading={t('thisWeekLabel', { week: format(startOfWeek(new Date()), 'MMMM d') })} />
      <Panel heading={t('productivityHistoryLabel')} />
    </Show>
  );
};
