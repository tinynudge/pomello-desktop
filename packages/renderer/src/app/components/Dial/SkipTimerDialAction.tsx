import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import DialAction from './DialAction';
import { DialActionProps } from './DialActionProps';
import { ReactComponent as SkipIcon } from './assets/skip.svg';

const SkipTimerDialAction: FC<DialActionProps> = ({ className, isVisible, onClick }) => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { skipTimer } = usePomelloActions();
  const { t } = useTranslation();

  useEffect(() => registerHotkeys({ skipBreak: skipTimer }), [registerHotkeys, skipTimer]);

  const handleActionClick = () => {
    skipTimer();
    onClick();
  };

  return (
    <DialAction
      className={className}
      isVisible={isVisible}
      label={t('skipBreakLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'skipBreakLabel', getHotkeyLabel('skipBreak'))}
    >
      <SkipIcon width={9} />
    </DialAction>
  );
};

export default SkipTimerDialAction;
