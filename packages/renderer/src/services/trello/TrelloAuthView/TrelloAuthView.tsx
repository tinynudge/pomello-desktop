import { AuthView } from '@/auth/ui/AuthView';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Component } from 'solid-js';
import { TRELLO_KEY } from '../constants';
import trelloLogo from './assets/trello.png';

type TrelloAuthViewProps = {
  setToken(token: string): void;
};

export const TrelloAuthView: Component<TrelloAuthViewProps> = props => {
  const getService = useService();
  const t = useTranslate();

  const authParams = new URLSearchParams({
    key: TRELLO_KEY,
    name: 'Pomello',
    expiration: 'never',
    scope: 'read,write',
    response_type: 'token',
  });

  const handleTokenSubmit = (token: string) => {
    props.setToken(window.app.encryptValue(token));
  };

  return (
    <AuthView>
      <AuthView.Instructions
        authUrl={`https://trello.com/1/authorize?${authParams}`}
        heading={t('connectToService', { service: getService().displayName })}
        logo={trelloLogo}
      />
      <AuthView.Form onSubmit={handleTokenSubmit} />
    </AuthView>
  );
};
