import useHotkeys from '@/app/hooks/useHotkeys';
import useShowAddNoteView from '@/app/hooks/useShowAddNoteView';
import createHintTitle from '@/shared/helpers/createHintTitle';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import DialAction from './DialAction';
import { DialActionProps } from './DialActionProps';
import { ReactComponent as PencilIcon } from './assets/pencil.svg';

const AddNoteDialAction: FC<DialActionProps> = ({ className, isVisible, onClick }) => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const showAddNoteView = useShowAddNoteView();
  const { t } = useTranslation();

  useEffect(() => {
    return registerHotkeys({
      addNote: () => showAddNoteView('generalNote'),
      externalDistraction: () => showAddNoteView('externalDistraction'),
      internalDistraction: () => showAddNoteView('internalDistraction'),
    });
  }, [registerHotkeys, showAddNoteView]);

  const handleActionClick = () => {
    showAddNoteView('generalNote');
    onClick();
  };

  return (
    <DialAction
      className={className}
      isVisible={isVisible}
      label={t('addNoteLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'addNoteLabel', getHotkeyLabel('addNote'))}
    >
      <PencilIcon width={12} />
    </DialAction>
  );
};

export default AddNoteDialAction;
