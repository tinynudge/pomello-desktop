import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { NoteType } from '@pomello-desktop/domain';
import { useStoreActions } from '../context/StoreContext';

export const useShowAddNoteView = () => {
  const { overlayViewSet } = useStoreActions();
  const getService = useService();
  const t = useTranslate();

  const showAddNoteView = (type: NoteType) => {
    const { displayName, onNoteCreate } = getService();

    if (!onNoteCreate) {
      new Notification(t('notesDisabledHeading'), {
        body: t('serviceActionUnavailable', { service: displayName }),
      });

      return;
    }

    overlayViewSet(type);
  };

  return showAddNoteView;
};
