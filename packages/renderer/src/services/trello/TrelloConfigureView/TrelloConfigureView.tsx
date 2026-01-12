import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { ToggleSwitch } from '@/ui/dashboard/ToggleSwitch';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Component, For } from 'solid-js';
import { createTrelloQueryClient } from '../createTrelloQueryClient';
import { createTrelloService } from '../createTrelloService';
import { TrelloConfigStore, TrelloPreferences } from '../domain';
import { BoardListPreferencesPanel } from './BoardListPreferencesPanel';
import { ConnectionPanel } from './ConnectionPanel';

const preferences = [
  { preference: 'addChecks', default: true },
  { preference: 'keepLogs', default: true },
  { preference: 'trackStats', default: true },
  { preference: 'archiveCards', default: false },
] as const;

export const TrelloConfigureView: Component = () => {
  const { getServiceConfigValue, stageServiceConfigValue } =
    useConfigureService<TrelloConfigStore>();
  const t = useTranslate();

  const handleGlobalPreferenceChange = (preference: keyof TrelloPreferences, checked: boolean) => {
    const preferences = getServiceConfigValue('preferences');

    stageServiceConfigValue('preferences', {
      ...preferences,
      global: {
        ...preferences?.global,
        [preference]: checked,
      },
    });
  };

  const handleLoginClick = () => {
    window.app.showAuthWindow({
      serviceId: createTrelloService.id,
      type: 'service',
    });
  };

  return (
    <QueryClientProvider client={createTrelloQueryClient()}>
      <ConnectionPanel onLoginClick={handleLoginClick} />
      <Panel
        heading={t('service:defaultPreferencesHeading')}
        padding="none"
        subHeading={t('service:defaultPreferencesSubheading')}
      >
        <Panel.List aria-label={t('service:defaultPreferencesLabel')}>
          <For each={preferences}>
            {({ preference, default: defaultValue }) => (
              <Panel.List.FormField
                actions={[
                  {
                    onClick: () => handleGlobalPreferenceChange(preference, defaultValue),
                    text: t('service:restoreDefault', {
                      value: t(`service:toggleDefault.${defaultValue}`),
                    }),
                  },
                ]}
                label={t(`service:preference.${preference}`)}
                for={`global-${preference}`}
              >
                <ToggleSwitch
                  checked={
                    getServiceConfigValue('preferences')?.global?.[preference] ?? defaultValue
                  }
                  id={`global-${preference}`}
                  onChange={checked => handleGlobalPreferenceChange(preference, checked)}
                />
              </Panel.List.FormField>
            )}
          </For>
        </Panel.List>
      </Panel>
      <BoardListPreferencesPanel onLoginClick={handleLoginClick} />
    </QueryClientProvider>
  );
};
