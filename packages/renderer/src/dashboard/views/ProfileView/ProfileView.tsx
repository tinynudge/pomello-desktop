import { LoginView } from '@/dashboard/views/LoginView';
import { usePomelloConfig } from '@/shared/context/RuntimeContext';
import { Component, Show } from 'solid-js';
import { ProfileForm } from './ProfileForm';

export const ProfileView: Component = () => {
  const pomelloConfig = usePomelloConfig();

  return (
    <Show when={pomelloConfig.store.user} fallback={<LoginView />}>
      {getUser => <ProfileForm user={getUser()} />}
    </Show>
  );
};
