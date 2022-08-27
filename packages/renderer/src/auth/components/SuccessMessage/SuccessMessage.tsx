import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect, useRef, useState } from 'react';

const SuccessMessage: FC = () => {
  const { t } = useTranslation();

  const [count, setCount] = useState(10);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (count !== 0) {
      timeoutRef.current = window.setTimeout(() => {
        setCount(previousCount => previousCount - 1);
      }, 1000);
    } else {
      window.close();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [count]);

  return (
    <>
      <p>{t('authSuccessMessage')}</p>
      <br />
      <p>{t('authCloseMessage', { count: `${count}` })}</p>
    </>
  );
};

export default SuccessMessage;
