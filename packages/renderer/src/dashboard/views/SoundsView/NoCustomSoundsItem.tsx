import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Component } from 'solid-js';
import { AddCustomSoundButton } from './AddCustomSoundButton';
import styles from './NoCustomSoundsItem.module.scss';

export const NoCustomSoundsItem: Component = () => {
  const t = useTranslate();

  return (
    <Panel.List.Item class={styles.noCustomSoundsItem}>
      <em>{t('noCustomSoundsAdded')}</em>
      <AddCustomSoundButton />
    </Panel.List.Item>
  );
};
