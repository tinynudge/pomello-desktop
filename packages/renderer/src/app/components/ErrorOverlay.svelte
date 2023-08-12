<script lang="ts">
  import getTranslator from '@/app/helpers/getTranslator';
  import ButtonsOverlay from '@/app/ui/ButtonsOverlay.svelte';
  import Heading from '@/app/ui/Heading.svelte';
  import type { ErrorOverlayProps } from '@domain';

  export let error: ErrorOverlayProps['error'];
  export let heading: ErrorOverlayProps['heading'] = undefined;
  export let message: ErrorOverlayProps['message'] = undefined;
  export let resetErrorBoundary: () => void;
  export let retryAction: ErrorOverlayProps['retryAction'] = undefined;

  const translate = getTranslator();

  const handleDetailsClick = async () => {
    const message = error instanceof Error ? error.message : `${error}`;

    const { response } = await window.app.showMessageBox({
      message: $translate('unexpectedErrorTitle', { message }),
      cancelId: 1,
      defaultId: 0,
      buttons: [$translate('errorDialogCopyError'), $translate('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      const type = error instanceof Error ? error.name : typeof error;
      const stack = error instanceof Error ? error.stack : undefined;

      const serializedError = { type, message, stack };

      window.app.writeClipboardText(JSON.stringify(serializedError, null, 2));
    }
  };

  const handleResetClick = () => {
    retryAction?.onClick();
    resetErrorBoundary();
  };
</script>

<ButtonsOverlay>
  {#if heading}
    <Heading>{heading}</Heading>
  {/if}
  {message ?? $translate('genericErrorMessage')}

  <svelte:fragment slot="buttons">
    {#if retryAction}
      <button on:click={handleResetClick}>{retryAction.label}</button>
    {/if}
    <button on:click={handleDetailsClick}>{$translate('errorDetails')}</button>
  </svelte:fragment>
</ButtonsOverlay>
