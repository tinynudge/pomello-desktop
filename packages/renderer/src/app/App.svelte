<script lang="ts">
  import { setPomelloServiceConfigContext } from '@/shared/contexts/pomelloServiceConfigContext';
  import { setSettingsContext } from '@/shared/contexts/settingsContext';
  import { setTranslationsContext } from '@/shared/contexts/translationsContext';
  import initializeService from '@/shared/helpers/initializeService/initializeService';
  import type {
    LabeledHotkeys,
    Logger,
    PomelloServiceConfig,
    ServiceConfig,
    ServiceRegistry,
    Settings,
    TranslationsDictionary,
  } from '@domain';
  import type { PomelloService } from '@tinynudge/pomello-service';
  import Layout from './components/Layout/Layout.svelte';
  import ServiceContainer from './components/ServiceContainer.svelte';
  import ServiceProvider from './components/ServiceProvider.svelte';
  import { setHotkeysContext } from './contexts/hotkeysContext';
  import { setPomelloStateContext } from './contexts/pomelloStateContext';
  import Content from './ui/Content';
  import LoadingText from './ui/LoadingText';
  import SelectServiceView from './views/SelectServiceView.svelte';

  export let hotkeys: LabeledHotkeys;
  export let initialServiceId: string | undefined;
  export let logger: Logger;
  export let pomelloService: PomelloService;
  export let pomelloServiceConfig: ServiceConfig<PomelloServiceConfig>;
  export let services: ServiceRegistry;
  export let settings: Settings;
  export let translations: TranslationsDictionary;

  setHotkeysContext(hotkeys);
  setPomelloServiceConfigContext(pomelloServiceConfig);
  setPomelloStateContext(pomelloService);
  setSettingsContext(settings);
  setTranslationsContext(translations);

  const initializeServiceResult = initializeService({ initialServiceId, logger, services });
  $: ({ activeService, status } = $initializeServiceResult);

  // TODO: Warn before app quit
  // TODO: Add useLogPomelloEvents
  // TODO: Add useTimerSounds
  // TODO: Add open task in browser
  // TODO: Add power change monitor
  // TODO: Add pomello account checker
  // TODO: Add task creation
</script>

<Layout>
  {#if status === 'READY'}
    {#if activeService}
      <ServiceProvider service={activeService.service}>
        <Content>
          <ServiceContainer>
            <svelte:component
              this={activeService.service.InitializingView?.component}
              {...activeService.service.InitializingView?.additionalProps}
              onReady={pomelloService.setReady}
            />
          </ServiceContainer>
        </Content>
      </ServiceProvider>
    {:else}
      <SelectServiceView {services} />
    {/if}
  {:else if status === 'INITIALIZING'}
    <Content>
      <LoadingText />
    </Content>
  {/if}
</Layout>
