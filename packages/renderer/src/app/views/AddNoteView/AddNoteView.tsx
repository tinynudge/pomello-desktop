import { setOverlayView, unsetOverlayView } from '@/app/appSlice';
import useCurrentTask from '@/app/hooks/useCurrentTask';
import Content from '@/app/ui/Content';
import Heading from '@/app/ui/Heading';
import InputField from '@/app/ui/InputField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { NoteType } from '@domain';
import { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface AddNoteViewProps {
  noteType: NoteType;
}

const noteTypeCodes: Record<string, NoteType> = {
  n: 'generalNote',
  "'": 'internalDistraction',
  '-': 'externalDistraction',
};

const AddNoteView: FC<AddNoteViewProps> = ({ noteType }) => {
  const dispatch = useDispatch();
  const service = useService();
  const { t } = useTranslation();

  const { currentTask } = useCurrentTask();

  const [note, setNote] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [noteType]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNote(event.currentTarget.value);
  };

  const handleInputEscape = () => {
    dispatch(unsetOverlayView());
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      const updatedNoteType = noteTypeCodes[note];

      if (updatedNoteType) {
        setNote('');

        dispatch(setOverlayView(updatedNoteType));

        event.preventDefault();
      }
    }
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

    service.onNoteCreate?.(currentTask.id, {
      label: t(`${noteType}Label`),
      text: note,
      type: noteType,
    });

    dispatch(unsetOverlayView());
  };

  return (
    <Content>
      <Heading>{t(`${noteType}Heading`)}</Heading>
      <InputField
        onChange={handleInputChange}
        onEscape={handleInputEscape}
        onKeyDown={handleInputKeyDown}
        onSubmit={handleInputSubmit}
        placeholder={t('addNotePlaceholder')}
        ref={inputRef}
        value={note}
      />
    </Content>
  );
};

export default AddNoteView;
