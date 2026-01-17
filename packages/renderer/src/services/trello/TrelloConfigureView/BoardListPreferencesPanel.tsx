import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { ActionsMenu } from '@/ui/dashboard/ActionsMenu';
import { Button } from '@/ui/dashboard/Button';
import { Error } from '@/ui/dashboard/Error';
import { LoadingDots } from '@/ui/dashboard/LoadingDots/LoadingDots';
import { Panel } from '@/ui/dashboard/Panel';
import { useQuery } from '@tanstack/solid-query';
import { Component, For, Match, Show, Switch } from 'solid-js';
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
          <Match when={boardsAndLists.isSuccess && boardsAndLists.data.boards}>
            {getBoards => (
              <Panel.Accordion>
                <For each={getBoards()}>
                  {board => (
                    <Panel.Accordion.Item
                      actions={[
                        {
                          text: t('service:resetBoardPreferences'),
                          onClick: () => {},
                        },
                      ]}
                      isPaddingDisabled
                      title={board.name}
                      titleExtras={<Button>{t('service:boardPreferences')}</Button>}
                    >
                      <Panel.List aria-label={t('service:listsLabel', { boardName: board.name })}>
                        <For each={board.lists}>
                          {list => (
                            <Panel.List.Item aria-labelledby={list.id} class={styles.listListItem}>
                              <span class={styles.listName} id={list.id}>
                                {list.name}
                              </span>
                              <Button>{t('service:listPreferences')}</Button>
                              <ActionsMenu
                                menuItems={[
                                  {
                                    text: t('service:resetListPreferences'),
                                    onClick: () => ({}),
                                  },
                                ]}
                                tooltip={t('service:more')}
                              />
                            </Panel.List.Item>
                          )}
                        </For>
                      </Panel.List>
                    </Panel.Accordion.Item>
                  )}
                </For>
              </Panel.Accordion>
            )}
          </Match>
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
