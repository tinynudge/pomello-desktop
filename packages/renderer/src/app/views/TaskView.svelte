<script lang="ts">
  import { getServiceContext } from '@/app/contexts/serviceContext';
  import getCurrentTask from '@/app/helpers/getCurrentTask';
  import Heading from '@/app/ui/Heading.svelte';
  import Text from '@/app/ui/Text.svelte';

  const { getTaskHeading } = getServiceContext();
  const currentTask = getCurrentTask();

  // TODO: Add add note handling and hotkeys
  // TODO: Add task related dial actions
</script>

{#if getTaskHeading}
  <Heading>{getTaskHeading()}</Heading>
{/if}
<Text>{$currentTask.label}</Text>
