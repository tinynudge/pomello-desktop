<script lang="ts">
  import getTranslator from '@/app/helpers/getTranslator';
  import SelectField from '@/app/ui/SelectField.svelte';
  import { onMount } from 'svelte';

  export let quickTaskMode: boolean;
  export let resetQuickTaskMode: () => void;

  const translate = getTranslator();

  onMount(() => {
    resetQuickTaskMode();
  });
</script>

<SelectField
  defaultOpen={quickTaskMode}
  items={[]}
  noResultsMessage={$translate('noTasksFound')}
  placeholder={$translate('selectTaskPlaceholder')}
/>
