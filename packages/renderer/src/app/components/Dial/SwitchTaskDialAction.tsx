import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import DialAction from './DialAction';
import { DialActionProps } from './DialActionProps';
import { ReactComponent as SwitchIcon } from './assets/switch.svg';

const SwitchTaskDialAction: FC<DialActionProps> = ({ className, isVisible, onClick }) => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { switchTask } = usePomelloActions();
  const { t } = useTranslation();

  useEffect(() => registerHotkeys({ switchTask }), [registerHotkeys, switchTask]);

  const handleActionClick = () => {
    switchTask();
    onClick();
  };

  return (
    <DialAction
      className={className}
      isVisible={isVisible}
      label={t('switchTaskLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'switchTaskLabel', getHotkeyLabel('switchTask'))}
    >
      <SwitchIcon width={16} />
    </DialAction>
  );
};

export default SwitchTaskDialAction;
