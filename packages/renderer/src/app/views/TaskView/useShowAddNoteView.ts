import { setOverlayView } from '@/app/appSlice';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { NoteType } from '@domain';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function useShowAddNoteView() {
  const { displayName, handleNoteAdd } = useService();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  return useCallback(
    (type: NoteType) => {
      return () => {
        if (!handleNoteAdd) {
          new Notification(t('notesDisabledHeading'), {
            body: t('notesDisabledContent', { service: displayName }),
          });

          return;
        }

        dispatch(setOverlayView(type));
      };
    },
    [dispatch, displayName, handleNoteAdd, t]
  );
}
