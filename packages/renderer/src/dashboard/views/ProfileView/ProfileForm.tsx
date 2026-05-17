import { MainHeader } from '@/dashboard/components/MainHeader';
import { SaveChangesBanner } from '@/dashboard/components/SaveChangesBanner';
import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { Input } from '@/ui/dashboard/Input';
import { Panel } from '@/ui/dashboard/Panel';
import { Select } from '@/ui/dashboard/Select';
import { PomelloUser, UpdateUserInput } from '@pomello-desktop/domain';
import { useMutation } from '@tanstack/solid-query';
import { nanoid } from 'nanoid';
import { Component, JSX, Show } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import styles from './ProfileForm.module.scss';
import { timezones } from './timezones';

type ProfileFormProps = {
  user: PomelloUser;
};

type StagedProfile = Partial<Pick<PomelloUser, 'name' | 'timezone'>>;

export const ProfileForm: Component<ProfileFormProps> = props => {
  const pomelloApi = usePomelloApi();
  const pomelloConfig = usePomelloConfig();
  const t = useTranslate();

  const [stagedProfile, setStagedProfile] = createStore<StagedProfile>({});

  const updateUserMutation = useMutation<
    PomelloUser,
    Error,
    UpdateUserInput,
    { previousUser: PomelloUser }
  >(() => ({
    mutationFn: (input: UpdateUserInput) => pomelloApi.updateUser(input),
    onMutate: (variables: UpdateUserInput) => {
      const previousUser = { ...props.user };
      const updatedUser = { ...props.user, ...variables };

      pomelloConfig.actions.userFetched(updatedUser);
      setStagedProfile(reconcile({}));

      return { previousUser };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousUser) {
        pomelloConfig.actions.userFetched(context.previousUser);
      }
    },
  }));

  const handleCancelSubscriptionClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = event => {
    event.preventDefault();

    window.app.openUrl(event.currentTarget.href);
  };

  const handleNameInput: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setStagedProfile('name', event.currentTarget.value);
  };

  const handleTimezoneChange = (value: string) => {
    setStagedProfile('timezone', value);
  };

  const handleUndoClick = () => {
    setStagedProfile(reconcile({}));
  };

  const handleSaveClick = () => {
    updateUserMutation.mutate({
      name: stagedProfile.name ?? props.user.name,
      timezone: stagedProfile.timezone ?? props.user.timezone,
    });
  };

  const getHasStagedChanges = () => !!Object.keys(stagedProfile).length;

  const id = nanoid();

  return (
    <>
      <MainHeader heading={t('routeProfile')} />
      <Panel heading={t('profile.detailsHeading')} padding="none">
        <Panel.List aria-label={t('profile.detailsHeading')}>
          <Panel.List.Item class={styles.accountType}>
            <span>{t('profile.accountType')}</span>
            <div>
              <Show
                fallback={
                  <span class={styles.freeText} data-testid="account-type">
                    {t('freeAccountLabel')}
                  </span>
                }
                when={props.user.type === 'premium'}
              >
                <span class={styles.premiumBadge} data-testid="account-type">
                  {t('premiumAccountLabel')}
                </span>
                <a
                  class={styles.cancelLink}
                  href={`${import.meta.env.VITE_APP_URL}/dashboard/user/subscription`}
                  onClick={handleCancelSubscriptionClick}
                >
                  {t('profile.cancelSubscription')}
                </a>
              </Show>
            </div>
          </Panel.List.Item>
          <Panel.List.FormField for={`${id}-display-name`} label={t('profile.displayName')}>
            <Input
              id={`${id}-display-name`}
              onInput={handleNameInput}
              type="text"
              value={stagedProfile.name ?? props.user.name}
            />
          </Panel.List.FormField>
          <Panel.List.FormField for={`${id}-email`} label={t('profile.email')}>
            <Input id={`${id}-email`} type="email" readonly value={props.user.email} />
          </Panel.List.FormField>
          <Panel.List.FormField for={`${id}-timezone`} label={t('profile.timezone')}>
            <Select
              id={`${id}-timezone`}
              onChange={handleTimezoneChange}
              options={timezones}
              value={stagedProfile.timezone ?? props.user.timezone}
            />
          </Panel.List.FormField>
        </Panel.List>
      </Panel>
      <Show when={getHasStagedChanges()}>
        <SaveChangesBanner onSaveClick={handleSaveClick} onUndoClick={handleUndoClick} />
      </Show>
    </>
  );
};
