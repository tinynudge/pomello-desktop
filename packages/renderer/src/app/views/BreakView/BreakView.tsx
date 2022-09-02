import { selectPomelloState } from '@/app/appSlice';
import DialLayout from '@/app/components/DialLayout';
import useDialActions from '@/app/hooks/useDialActions';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import Heading from '@/app/ui/Heading';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as SkipIcon } from './assets/skip.svg';
import NextTaskHeading from './NextTaskHeading';

interface BreakViewProps {
  type: 'SHORT_BREAK' | 'LONG_BREAK';
}

const BreakView: FC<BreakViewProps> = ({ type }) => {
  const { t } = useTranslation();
  const { skipTimer } = usePomelloActions();
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();

  const { currentTaskId } = useSelector(selectPomelloState);

  useEffect(() => {
    return registerHotkeys({
      skipBreak: skipTimer,
    });
  }, [registerHotkeys, skipTimer]);

  const { registerDialActions } = useDialActions();
  useEffect(() => {
    return registerDialActions([
      {
        Content: <SkipIcon width={9} />,
        id: 'skipBreak',
        label: t('skipBreakLabel'),
        onClick: skipTimer,
        title: t('skipBreakTitle', { hotkey: getHotkeyLabel('skipBreak') }),
      },
    ]);
  }, [getHotkeyLabel, registerDialActions, skipTimer, t]);

  const breakMessageKey = type === 'SHORT_BREAK' ? 'shortBreakMessage' : 'longBreakMessage';

  return (
    <DialLayout>
      {currentTaskId ? <NextTaskHeading /> : <Heading>{t('newTaskHeading')}</Heading>}
      <p>{t(breakMessageKey)}</p>
    </DialLayout>
  );
};

export default BreakView;
