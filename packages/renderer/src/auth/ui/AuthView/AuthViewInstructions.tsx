import useTranslation from '@/shared/hooks/useTranslation';
import { FC, MouseEvent, ReactNode } from 'react';
import styles from './AuthViewInstructions.module.scss';

interface AuthViewInstructionsProps {
  authUrl?: string;
  children?: ReactNode;
  heading?: string;
  logo?: ReactNode;
}

const AuthViewInstructions: FC<AuthViewInstructionsProps> = ({
  authUrl,
  children,
  heading,
  logo,
}) => {
  const { t } = useTranslation();

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.app.openUrl(event.currentTarget.href);
  };

  return (
    <div className={styles.instructions}>
      {typeof logo === 'string' ? (
        <img className={styles.logo} src={logo} alt="" width={128} height={128} />
      ) : (
        <>{logo}</>
      )}
      {heading && <h1 className={styles.heading}>{heading}</h1>}
      {authUrl && (
        <>
          <p>{t('authInstructions')}</p>
          <a href={authUrl} onClick={handleLinkClick}>
            {authUrl}
          </a>
        </>
      )}
      {children}
    </div>
  );
};

export default AuthViewInstructions;
