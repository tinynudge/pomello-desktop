<script lang="ts">
  import { getErrorOverlayContext } from '@/app/contexts/errorOverlayContext';
  import { getPomelloActionsContext } from '@/app/contexts/pomelloActionsContext';
  import { getServiceContext } from '@/app/contexts/serviceContext';
  import getTranslator from '@/app/helpers/getTranslator';
  import Heading from '@/app/ui/Heading.svelte';
  import LoadingText from '@/app/ui/LoadingText.svelte';
  import SelectField from '@/app/ui/SelectField.svelte';
  import { createQuery } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';

  export let quickTaskMode: boolean;
  export let resetQuickTaskMode: () => void;

  const { fetchTasks, getSelectTaskHeading, onTaskSelect, SelectTaskView } = getServiceContext();
  const pomelloActions = getPomelloActionsContext();
  const setErrorOverlay = getErrorOverlayContext();
  const translate = getTranslator();

  const tasks = createQuery({
    cacheTime: Infinity,
    onError: error => {
      setErrorOverlay({
        heading: translate('errorHeading'),
        message: translate('fetchTasksErrorMessage'),
        error,
        retryAction: {
          label: translate('errorRetry'),
          onClick: $tasks.refetch,
        },
      });
    },
    queryFn: fetchTasks,
    queryKey: ['todo', 'replace', 'me'],
  });

  const initialQuickTaskMode = quickTaskMode;

  onMount(() => {
    resetQuickTaskMode();
  });

  const handleTaskSelect = (event: CustomEvent<string>) => {
    selectTask(event.detail);
  };

  const selectTask = (id: string) => {
    const response = onTaskSelect?.(id);

    if (response !== false) {
      pomelloActions.selectTask(id);
    }
  };

  // TODO: Add pause dial action when timer is active
  // TODO: Replace query key
</script>

{#if SelectTaskView}
  <svelte:component
    this={SelectTaskView.component}
    {...SelectTaskView.additionalProps}
    {selectTask}
  />
{:else if $tasks.isSuccess}
  {#if getSelectTaskHeading}
    <Heading>{getSelectTaskHeading()}</Heading>
  {/if}
  <SelectField
    defaultOpen={initialQuickTaskMode}
    items={$tasks.data}
    noResultsMessage={translate('noTasksFound')}
    on:change={handleTaskSelect}
    placeholder={translate('selectTaskPlaceholder')}
  />
{:else if $tasks.isFetching}
  <LoadingText />
{/if}
