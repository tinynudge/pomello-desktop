import { useTranslate } from '@/shared/context/RuntimeContext';
import { Component } from 'solid-js';

export const LoadingText: Component = () => {
  const t = useTranslate();

  return t('waitMessage');
};
