<script lang="ts">
  import getTranslator from '@/app/helpers/getTranslator';
  import ButtonsOverlay from '@/app/ui/ButtonsOverlay.svelte';
  import Heading from '@/app/ui/Heading.svelte';

  export let error: Error;
  export let heading: string | undefined = undefined;
  export let message: string | undefined = undefined;

  const translate = getTranslator();

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: $translate('unexpectedErrorTitle', { message: error.message }),
      cancelId: 1,
      defaultId: 0,
      buttons: [$translate('errorDialogCopyError'), $translate('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      const serializedError = {
        type: error.name,
        message: error.message,
        stack: error.stack?.split('\n'),
      };

      window.app.writeClipboardText(JSON.stringify(serializedError, null, 2));
    }
  };
</script>

<ButtonsOverlay>
  {#if heading}
    <Heading>{heading}</Heading>
  {/if}
  {message ?? $translate('genericErrorMessage')}

  <svelte:fragment slot="buttons">
    <slot name="action" />
    <button on:click={handleDetailsClick}>{$translate('errorDetails')}</button>
  </svelte:fragment>
</ButtonsOverlay>
