<script lang="ts">
  import type { SelectItem, Service } from '@domain';
  import { createEventDispatcher } from 'svelte';
  import DropdownList from './DropdownList.svelte';
  import DropdownRow from './DropdownRow.svelte';

  export let activeOptionId: string | undefined = undefined;
  export let depth = 0;
  export let item: SelectItem;
  export let service: Service | undefined = undefined;

  const dispatch = createEventDispatcher<{
    hover: string;
    select: string;
  }>();

  const handleOptionHover = () => {
    dispatch('hover', item.id);
  };

  const handleOptionSelect = () => {
    dispatch('select', item.id);
  };

  // TODO: Custom groups and custom options
</script>

{#if item.type === 'group' || item.type === 'customGroup'}
  <DropdownList
    {activeOptionId}
    {service}
    aria-labelledby={item.id}
    depth={depth + 1}
    items={item.items}
    on:hover
    on:select
    role="group"
  >
    <DropdownRow id={item.id} role="presentation" type="group">
      <span class="label">{item.label}</span>
      {#if item.hint}
        <span class="hint">{item.hint}</span>
      {/if}
    </DropdownRow>
  </DropdownList>
{:else}
  <DropdownRow
    id={item.id}
    isSelected={activeOptionId === item.id}
    on:click={handleOptionSelect}
    on:mouseenter={handleOptionHover}
    role="option"
  >
    <span class="label">{item.label}</span>
    {#if item.hint}
      <span class="hint">{item.hint}</span>
    {/if}
  </DropdownRow>
{/if}

<style lang="scss">
  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hint {
    display: inline-block;
    padding-left: 8px;
    color: var(--select-content-helper);
    font-size: 12px;
  }
</style>
