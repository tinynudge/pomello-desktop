import { setOverlayView } from '@/app/appSlice';
import useTranslation from '@/shared/hooks/useTranslation';
import { NoteType, Service } from '@domain';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export function useShowAddNoteView(service: Service) {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  return useCallback(
    (type: NoteType) => {
      return () => {
        if (!service.handleNoteAdd) {
          new Notification(t('notesDisabledHeading'), {
            body: t('notesDisabledContent', { service: service.displayName }),
          });

          return;
        }

        dispatch(setOverlayView(type));
      };
    },
    [dispatch, service.displayName, service.handleNoteAdd, t]
  );
}
