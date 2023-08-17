import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import DialAction from './DialAction';
import { DialActionProps } from './DialActionProps';
import { ReactComponent as PauseIcon } from './assets/pause.svg';

const PauseTimerDialAction: FC<DialActionProps> = ({ className, isVisible, onClick }) => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { pauseTimer } = usePomelloActions();
  const { t } = useTranslation();

  useEffect(() => registerHotkeys({ pauseTimer }), [pauseTimer, registerHotkeys]);

  const handleActionClick = () => {
    pauseTimer();
    onClick();
  };

  return (
    <DialAction
      className={className}
      isVisible={isVisible}
      label={t('pauseTimerLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'pauseTimerLabel', getHotkeyLabel('pauseTimer'))}
    >
      <PauseIcon width={6} />
    </DialAction>
  );
};

export default PauseTimerDialAction;
