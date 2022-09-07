import AuthView from '@/auth/ui/AuthView';
import useService from '@/shared/hooks/useService';
import useServiceConfig from '@/shared/hooks/useServiceConfig';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';
import { TRELLO_KEY } from '../constants';
import { TrelloConfig } from '../domain';
import trelloLogo from './assets/trello.png';

const TrelloAuthView: FC = () => {
  const { t } = useTranslation();

  const { displayName } = useService();
  const [, setConfig] = useServiceConfig<TrelloConfig>();

  const authParams = new URLSearchParams({
    key: TRELLO_KEY,
    name: 'Pomello',
    expiration: 'never',
    scope: 'read,write',
    response_type: 'token',
  });

  const handleTokenSubmit = (token: string) => {
    setConfig('token', window.app.encryptValue(token));
  };

  return (
    <AuthView>
      <AuthView.Instructions
        logo={trelloLogo}
        authUrl={`https://trello.com/1/authorize?${authParams}`}
        heading={t('connectToService', { service: displayName })}
      />
      <AuthView.Form onSubmit={handleTokenSubmit} />
    </AuthView>
  );
};

export default TrelloAuthView;
