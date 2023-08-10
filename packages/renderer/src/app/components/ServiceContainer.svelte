<script lang="ts">
  import { getServiceContext } from '@/app/contexts/serviceContext';

  const service = getServiceContext();
</script>

{#if service.Container}
  <svelte:component this={service.Container.component} {...service.Container.additionalProps}>
    <slot />
  </svelte:component>
{:else}
  <slot />
{/if}
