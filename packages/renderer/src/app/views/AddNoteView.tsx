import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Content } from '@/ui/app/Content';
import { Heading } from '@/ui/app/Heading';
import { InputField } from '@/ui/app/InputField';
import { NoteType } from '@tinynudge/pomello-service';
import { Component, JSX, createSignal, onMount } from 'solid-js';
import { usePomelloActions } from '../context/PomelloContext';
import { useStoreActions } from '../context/StoreContext';
import { useCurrentTask } from '../hooks/useCurrentTask';

type AddNoteViewProps = {
  noteType: NoteType;
};

const noteTypeCodes: Record<string, NoteType> = {
  n: 'generalNote',
  "'": 'internalDistraction',
  '-': 'externalDistraction',
};

export const AddNoteView: Component<AddNoteViewProps> = props => {
  const { addNoteHandled } = usePomelloActions();
  const { overlayViewCleared, overlayViewSet } = useStoreActions();
  const currentTask = useCurrentTask();
  const getService = useService();
  const t = useTranslate();

  const [getNote, setNote] = createSignal('');

  let inputRef: HTMLInputElement;

  const handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setNote(event.currentTarget.value);
  };

  const handleInputEscape = () => {
    overlayViewCleared();
  };

  const handleInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    if (event.key === 'Tab') {
      const updatedNoteType = noteTypeCodes[getNote()];

      if (updatedNoteType) {
        setNote('');

        overlayViewSet(updatedNoteType);

        event.preventDefault();
      }
    }
  };

  const handleInputSubmit = () => {
    if (!getNote()) {
      return;
    }

    if (getNote() === '/?') {
      setNote('');

      window.app.openUrl(`${import.meta.env.VITE_APP_URL}/help#adding-notes`);

      return;
    }

    const { onNoteCreate } = getService();

    if (onNoteCreate) {
      const note = getNote();

      window.app.logMessage('debug', 'Will create note');

      onNoteCreate(currentTask().item.id, {
        label: t(`${props.noteType}Label`),
        text: note,
        type: props.noteType,
      });

      addNoteHandled(note, props.noteType);
    }

    overlayViewCleared();
  };

  onMount(() => {
    inputRef.focus();
  });

  return (
    <Content>
      <Heading>{t(`${props.noteType}Heading`)}</Heading>
      <InputField
        onEscape={handleInputEscape}
        onInput={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onSubmit={handleInputSubmit}
        placeholder={t('addNotePlaceholder')}
        ref={inputRef!}
        value={getNote()}
      />
    </Content>
  );
};
