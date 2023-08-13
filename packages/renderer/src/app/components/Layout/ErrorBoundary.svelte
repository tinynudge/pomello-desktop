<script lang="ts">
  import ErrorOverlay from '@/app/components/ErrorOverlay.svelte';
  import { setErrorOverlayContext } from '@/app/contexts/errorOverlayContext';
  import { getPomelloActionsContext } from '@/app/contexts/pomelloActionsContext';
  import getTranslator from '@/app/helpers/getTranslator';
  import type { ErrorOverlayProps, Logger, Service } from '@domain';
  import { writable } from 'svelte/store';

  export let service: Service | undefined;
  export let logger: Logger;

  const { reset } = getPomelloActionsContext();
  const translate = getTranslator();

  const errorOverlay = writable<ErrorOverlayProps | undefined>();

  const setErrorOverlay = (errorOverlayProps: ErrorOverlayProps) => {
    const customErrorOverlay = service?.handleError?.(errorOverlayProps.error);

    $errorOverlay = customErrorOverlay ?? errorOverlayProps;
  };

  setErrorOverlayContext(setErrorOverlay);

  $: if ($errorOverlay?.error instanceof Error) {
    const message = {
      message: $errorOverlay.error.message,
      stack: $errorOverlay.error.stack,
    };

    logger.error(JSON.stringify(message));
  }

  const handleUnhandledError = (event: Event) => {
    if (event instanceof ErrorEvent) {
      setErrorOverlay({
        ...defaultErrorOverlayProps,
        error: event.error,
      });
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    setErrorOverlay({
      ...defaultErrorOverlayProps,
      error: event.reason,
    });
  };

  const resetErrorBoundary = () => {
    errorOverlay.set(undefined);
  };

  const defaultErrorOverlayProps = {
    heading: translate('errorHeading'),
    message: translate('errorMessage'),
    retryAction: {
      label: translate('errorReset'),
      onClick: reset,
    },
  };
</script>

<svelte:window on:error={handleUnhandledError} on:unhandledrejection={handleUnhandledRejection} />

{#if $errorOverlay}
  <div class="content">
    <ErrorOverlay {...$errorOverlay} {resetErrorBoundary} />
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
