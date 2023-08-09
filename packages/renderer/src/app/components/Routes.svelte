<script lang="ts">
  import { getPomelloActionsContext } from '@/app/contexts/pomelloActionsContext';
  import { getPomelloStateContext } from '@/app/contexts/pomelloStateContext';
  import { getServiceContext } from '@/app/contexts/serviceContext';
  import SelectTaskView from '@/app/views/SelectTaskView.svelte';
  import { derived } from 'svelte/store';

  const { setReady } = getPomelloActionsContext();
  const pomelloState = getPomelloStateContext();
  const service = getServiceContext();
  const status = derived(pomelloState, $pomelloState => $pomelloState.status);

  let quickTaskMode = false;

  const handleServiceReady = (options: { openTaskSelect?: boolean } = {}) => {
    if (options.openTaskSelect) {
      quickTaskMode = true;
    }

    setReady();
  };

  const resetQuickTaskMode = () => {
    quickTaskMode = false;
  };
</script>

{#if $status === 'INITIALIZING'}
  {#if service.InitializingView}
    <svelte:component
      this={service.InitializingView.component}
      {...service.InitializingView.additionalProps}
      onReady={handleServiceReady}
    />
  {:else}
    {setReady()}
  {/if}
{:else if $status === 'SELECT_TASK'}
  <SelectTaskView {quickTaskMode} {resetQuickTaskMode} />
{/if}
