import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Component, For, Match, Switch } from 'solid-js';
import { MainHeader } from '../../components/MainHeader';
import { PomodoroSetSettingField } from './PomodoroSetSettingField';
import { SelectSettingField } from './SelectSettingField';
import { SyncDetails } from './SyncDetails';
import { TimeSettingField } from './TimeSettingField';
import { ToggleSettingField } from './ToggleSettingField';
import { settingsByCategory } from './settingsByCategory';

export const SettingsView: Component = () => {
  const t = useTranslate();

  return (
    <>
      <MainHeader heading={t('routeSettings')}>
        <SyncDetails />
      </MainHeader>
      <For each={settingsByCategory}>
        {category => (
          <Panel heading={t(category.headingKey)} padding="none">
            <Panel.List aria-label={t(category.listLabelKey)}>
              <For each={category.settings}>
                {setting => (
                  <Switch>
                    <Match when={setting.type === 'pomodoroSet' && setting}>
                      {getSetting => <PomodoroSetSettingField setting={getSetting()} />}
                    </Match>
                    <Match when={setting.type === 'select' && setting}>
                      {getSetting => <SelectSettingField setting={getSetting()} />}
                    </Match>
                    <Match when={setting.type === 'time' && setting}>
                      {getSetting => <TimeSettingField setting={getSetting()} />}
                    </Match>
                    <Match when={setting.type === 'toggle' && setting}>
                      {getSetting => <ToggleSettingField setting={getSetting()} />}
                    </Match>
                  </Switch>
                )}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
    </>
  );
};
