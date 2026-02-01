import { MainHeader } from '@/dashboard/components/MainHeader';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { format, startOfWeek } from 'date-fns';
import { Component } from 'solid-js';

export const ProductivityView: Component = () => {
  const t = useTranslate();

  return (
    <>
      <MainHeader heading={t('routeProductivity')}>
        <Button>Export data</Button>
      </MainHeader>
      <Panel heading={t('todayLabel')} />
      <Panel heading={t('thisWeekLabel', { week: format(startOfWeek(new Date()), 'MMMM d') })} />
      <Panel heading={t('productivityHistoryLabel')} />
    </>
  );
};
