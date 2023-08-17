import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import DialAction from './DialAction';
import { DialActionProps } from './DialActionProps';
import { ReactComponent as CloseIcon } from './assets/close.svg';

const VoidTaskDialAction: FC<DialActionProps> = ({ className, isVisible, onClick }) => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { voidTask } = usePomelloActions();
  const { t } = useTranslation();

  useEffect(() => registerHotkeys({ voidTask }), [registerHotkeys, voidTask]);

  const handleActionClick = () => {
    voidTask();
    onClick();
  };

  return (
    <DialAction
      className={className}
      isVisible={isVisible}
      label={t('voidTaskLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'voidTaskLabel', getHotkeyLabel('voidTask'))}
    >
      <CloseIcon width={10} />
    </DialAction>
  );
};

export default VoidTaskDialAction;
