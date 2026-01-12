import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Error } from '@/ui/dashboard/Error';
import { LoadingDots } from '@/ui/dashboard/LoadingDots/LoadingDots';
import { Panel } from '@/ui/dashboard/Panel';
import { useQuery } from '@tanstack/solid-query';
import { Component, Match, Show, Switch } from 'solid-js';
import { fetchBoardsAndLists } from '../api/fetchBoardsAndLists';
import { TrelloConfigStore } from '../domain';
import styles from './BoardListPreferencesPanel.module.scss';

type BoardListPreferencesPanelProps = {
  onLoginClick(): void;
};

export const BoardListPreferencesPanel: Component<BoardListPreferencesPanelProps> = props => {
  const { getServiceConfigValue } = useConfigureService<TrelloConfigStore>();
  const t = useTranslate();

  const boardsAndLists = useQuery(() => ({
    queryFn: fetchBoardsAndLists,
    queryKey: ['boardsAndLists'],
  }));

  const getHasToken = () => !!getServiceConfigValue('token');

  return (
    <Panel heading={t('service:boardListPreferencesHeading')} padding="none">
      <Show
        when={getHasToken()}
        fallback={
          <div class={styles.fallbackContent}>
            <p>{t('service:boardListPreferencesAccountRequired')}</p>
            <Button onClick={props.onLoginClick} variant="primary">
              {t('service:login')}
            </Button>
          </div>
        }
      >
        <Switch>
          <Match when={boardsAndLists.isError && boardsAndLists.error}>
            {getError => (
              <div class={styles.fallbackContent}>
                <Error
                  error={getError()}
                  message={t('service:fetchBoardsListsErrorHeading')}
                  retry={boardsAndLists.refetch}
                />
              </div>
            )}
          </Match>
          <Match when={boardsAndLists.isPending}>
            <div class={styles.fallbackContent}>
              <LoadingDots />
            </div>
          </Match>
        </Switch>
      </Show>
    </Panel>
  );
};
