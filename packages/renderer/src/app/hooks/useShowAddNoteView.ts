import { setOverlayView } from '@/app/appSlice';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { NoteType } from '@domain';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const useShowAddNoteView = () => {
  const { displayName, onNoteCreate } = useService();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  return useCallback(
    (type: NoteType) => {
      if (!onNoteCreate) {
        new Notification(t('notesDisabledHeading'), {
          body: t('serviceActionUnavailable', { service: displayName }),
        });

        return;
      }

      dispatch(setOverlayView(type));
    },
    [dispatch, displayName, onNoteCreate, t]
  );
};

export default useShowAddNoteView;
