import { useHotkeys } from '@/app/context/HotkeysContext';
import { useShowAddNoteView } from '@/app/hooks/useShowAddNoteView';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { createHintTitle } from '@/shared/helpers/createHintTitle';
import { Component } from 'solid-js';
import { DialAction } from './DialAction';
import { DialActionProps } from './DialActionProps';
import PencilIcon from './assets/pencil.svg';

export const AddNoteDialAction: Component<DialActionProps> = props => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const showAddNoteView = useShowAddNoteView();
  const t = useTranslate();

  const handleActionClick = () => {
    showAddNoteView('generalNote');
    props.onClick();
  };

  registerHotkeys({
    addNote: () => showAddNoteView('generalNote'),
    externalDistraction: () => showAddNoteView('externalDistraction'),
    internalDistraction: () => showAddNoteView('internalDistraction'),
  });

  return (
    <DialAction
      class={props.class}
      isVisible={props.isVisible}
      label={t('addNoteLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'addNoteLabel', getHotkeyLabel('addNote'))}
    >
      <PencilIcon width={12} />
    </DialAction>
  );
};
