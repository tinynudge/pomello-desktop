import { setOverlayView, unsetOverlayView } from '@/app/appSlice';
import Heading from '@/app/ui/Heading';
import InputField from '@/app/ui/InputField';
import useTranslation from '@/shared/hooks/useTranslation';
import { NoteType, Service } from '@domain';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface AddNoteViewProps {
  noteType: NoteType;
  service: Service;
}

const noteTypeCodes: Record<string, NoteType> = {
  n: 'generalNote',
  "'": 'internalDistraction',
  '-': 'externalDistraction',
};

const AddNoteView: FC<AddNoteViewProps> = ({ noteType, service }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [note, setNote] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [noteType]);

  const handleInputBlur = () => {
    const updatedNoteType = noteTypeCodes[note];

    if (updatedNoteType) {
      setNote('');

      dispatch(setOverlayView(updatedNoteType));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNote(event.currentTarget.value);
  };

  const handleInputEscape = () => {
    dispatch(unsetOverlayView());
  };

  const handleInputSubmit = () => {
    if (!note) {
      return;
    }

    if (note === '/?') {
      setNote('');

      window.app.openUrl(`${import.meta.env.VITE_APP_URL}/help#adding-notes`);

      return;
    }

    service.handleNoteAdd?.(noteType, note);

    dispatch(unsetOverlayView());
  };

  return (
    <>
      <Heading>{t(`${noteType}Heading`)}</Heading>
      <InputField
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onEscape={handleInputEscape}
        onSubmit={handleInputSubmit}
        placeholder={t('addNotePlaceholder')}
        ref={inputRef}
        value={note}
      />
    </>
  );
};

export default AddNoteView;
