import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';
import { MainHeader } from '../../components/MainHeader';
import { SyncDetails } from './SyncDetails';

export const SettingsView: Component = () => {
  const t = useTranslate();

  return (
    <MainHeader heading={t('routeSettings')}>
      <SyncDetails />
    </MainHeader>
  );
};
