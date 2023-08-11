<script lang="ts">
  import ErrorOverlay from '@/app/components/ErrorOverlay.svelte';
  import { getPomelloActionsContext } from '@/app/contexts/pomelloActionsContext';
  import getTranslator from '@/app/helpers/getTranslator';
  import type { Logger, Service } from '@domain';
  import { writable } from 'svelte/store';
  import ServiceContainer from '../ServiceContainer.svelte';
  import ServiceProvider from '../ServiceProvider.svelte';

  export let service: Service | undefined;
  export let logger: Logger;

  const { reset } = getPomelloActionsContext();
  const translate = getTranslator();

  const error = writable<Error | undefined>();

  $: if ($error instanceof Error) {
    const message = {
      message: $error.message,
      stack: $error.stack,
    };

    logger.error(JSON.stringify(message));
  }

  const handleUnhandledError = (event: Event) => {
    if (event instanceof ErrorEvent) {
      error.set(event.error);
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    error.set(event.reason);
  };

  const handleResetClick = () => {
    reset();
    resetErrorBoundary();
  };

  const resetErrorBoundary = () => {
    error.set(undefined);
  };
</script>

<svelte:window on:error={handleUnhandledError} on:unhandledrejection={handleUnhandledRejection} />

{#if $error}
  {@const customErrorView = service?.handleError?.({ error: $error, resetErrorBoundary })}
  <div class="content">
    {#if customErrorView && service}
      <ServiceProvider {service}>
        <ServiceContainer>
          <svelte:component this={customErrorView.component} {...customErrorView.additionalProps} />
        </ServiceContainer>
      </ServiceProvider>
    {:else}
      <ErrorOverlay error={$error}>
        <button slot="action" on:click={handleResetClick}>{$translate('errorReset')}</button>
      </ErrorOverlay>
    {/if}
  </div>
{:else}
  <slot />
{/if}

<style lang="scss">
  .content {
    position: relative;
    overflow: hidden;
    height: 100vh;
    flex: 1;
  }
</style>
