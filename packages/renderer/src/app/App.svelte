<script lang="ts">
  import { setPomelloServiceConfigContext } from '@/shared/contexts/pomelloServiceConfigContext';
  import { setSettingsContext } from '@/shared/contexts/settingsContext';
  import { setTranslationsContext } from '@/shared/contexts/translationsContext';
  import initializeService from '@/shared/helpers/initializeService/initializeService';
  import type {
    Logger,
    PomelloServiceConfig,
    ServiceConfig,
    ServiceRegistry,
    Settings,
    TranslationsDictionary,
  } from '@domain';
  import type { PomelloService } from '@tinynudge/pomello-service';
  import SelectServiceView from './views/SelectServiceView.svelte';

  export let initialServiceId: string | undefined;
  export let logger: Logger;
  export let pomelloService: PomelloService;
  export let pomelloServiceConfig: ServiceConfig<PomelloServiceConfig>;
  export let services: ServiceRegistry;
  export let settings: Settings;
  export let translations: TranslationsDictionary;

  setPomelloServiceConfigContext(pomelloServiceConfig);
  setSettingsContext(settings);
  setTranslationsContext(translations);

  const initializeServiceResult = initializeService({ initialServiceId, logger, services });
  $: ({ activeService, status } = $initializeServiceResult);

  // TODO: Warn before app quit
  // TODO: Add active service
  // TODO: Add useLogPomelloEvents
  // TODO: Add useTimerSounds
  // TODO: Add open task in browser
  // TODO: Add power change monitor
  // TODO: Add pomello account checker
  // TODO: Add task creation
</script>

{#if status === 'READY'}
  {#if activeService}
    <p>Active service: {activeService.service.id}</p>
    <svelte:component
      this={activeService.service.InitializingView?.component}
      onReady={() => {
        pomelloService.setReady();
        // TODO: Add onReady
      }}
      {...activeService.service.InitializingView?.additionalProps}
    />
  {:else}
    <SelectServiceView {services} />
  {/if}
{:else if status === 'INITIALIZING'}
  <p>Initializing...</p>
{/if}
