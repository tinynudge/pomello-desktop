import useTranslation from '@/shared/hooks/useTranslation';
import { DialAction } from '@domain';
import { useEffect, useMemo } from 'react';
import { ReactComponent as PauseIcon } from './assets/pause.svg';
import useHotkeys from './useHotkeys';
import usePomelloActions from './usePomelloActions';

const usePauseDialAction = (): DialAction => {
  const { t } = useTranslation();

  const { pauseTimer } = usePomelloActions();

  const { registerHotkeys } = useHotkeys();

  useEffect(() => {
    return registerHotkeys({ pauseTimer });
  }, [pauseTimer, registerHotkeys]);

  return useMemo(
    () => ({
      Content: <PauseIcon width={6} />,
      id: 'pauseTimer',
      label: t('pauseTimerLabel'),
      onClick: pauseTimer,
    }),
    [pauseTimer, t]
  );
};

export default usePauseDialAction;
