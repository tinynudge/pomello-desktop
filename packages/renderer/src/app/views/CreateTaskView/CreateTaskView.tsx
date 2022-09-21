import { unsetOverlayView } from '@/app/appSlice';
import Content from '@/app/ui/Content';
import Heading from '@/app/ui/Heading';
import InputField from '@/app/ui/InputField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

const CreateTaskView: FC = () => {
  const dispatch = useDispatch();
  const service = useService();
  const { t } = useTranslation();

  const [text, setText] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  const handleInputEscape = () => {
    dispatch(unsetOverlayView());
  };

  const handleInputSubmit = () => {
    if (!text) {
      return;
    }

    if (text === '/?') {
      setText('');

      window.app.openUrl(`${import.meta.env.VITE_APP_URL}/help#creating-tasks`);

      return;
    }

    service.handleTaskCreate?.(text);

    dispatch(unsetOverlayView());
  };

  return (
    <Content>
      <Heading>{t('createTaskHeading')}</Heading>
      <InputField
        onChange={handleInputChange}
        onEscape={handleInputEscape}
        onSubmit={handleInputSubmit}
        placeholder={t('createTaskPlaceholder')}
        ref={inputRef}
        value={text}
      />
    </Content>
  );
};

export default CreateTaskView;
