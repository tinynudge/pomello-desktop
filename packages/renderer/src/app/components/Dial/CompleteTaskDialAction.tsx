import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import DialAction from './DialAction';
import { DialActionProps } from './DialActionProps';
import { ReactComponent as CheckIcon } from './assets/check.svg';

const CompleteTaskDialAction: FC<DialActionProps> = ({ className, isVisible, onClick }) => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { completeTask } = usePomelloActions();
  const { t } = useTranslation();

  useEffect(
    () => registerHotkeys({ completeTaskEarly: completeTask }),
    [registerHotkeys, completeTask]
  );

  const handleActionClick = () => {
    completeTask();
    onClick();
  };

  return (
    <DialAction
      className={className}
      isVisible={isVisible}
      label={t('completeTaskLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'completeTaskLabel', getHotkeyLabel('completeTaskEarly'))}
    >
      <CheckIcon width={13} />
    </DialAction>
  );
};

export default CompleteTaskDialAction;
