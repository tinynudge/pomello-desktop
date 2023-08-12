<script lang="ts">
  import type { InitializingViewProps } from '@domain';
  import { onMount } from 'svelte';

  type $$Props = InitializingViewProps;

  export let onReady: $$Props['onReady'];
  export let openTaskSelect: boolean = false;

  onMount(() => {
    onReady({ openTaskSelect });
  });
</script>

<slot />
