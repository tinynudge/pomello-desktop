<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Events {
    hover: CustomEvent<string>;
    select: CustomEvent<string>;
  }

  import type { SelectItem, Service } from '@domain';
  import DropdownItem from './DropdownItem.svelte';
  import DropdownRow from './DropdownRow.svelte';

  export let activeOptionId: string | undefined = undefined;
  export let depth = 0;
  export let items: SelectItem[];
  export let listElement: HTMLDivElement | undefined = undefined;
  export let noItemsMessage: string | undefined = undefined;
  export let service: Service | undefined = undefined;
</script>

<div {...$$restProps} bind:this={listElement} style={`--row-depth: ${depth}`}>
  <slot />
  {#if items.length}
    {#each items as item (item.id)}
      <DropdownItem {activeOptionId} {depth} {item} {service} on:hover on:select />
    {/each}
  {:else if noItemsMessage}
    <DropdownRow isDisabled role="alert">
      {noItemsMessage}
    </DropdownRow>
  {/if}
</div>
