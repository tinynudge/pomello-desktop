<script lang="ts">
  import type { SelectItem } from '@domain';
  import { vi } from 'vitest';
  import SelectField from '../SelectField.svelte';

  export let defaultOpen = false;
  export let items: SelectItem[] = [];
  export let noResultsMessage: string | undefined = undefined;
  export let onChange = vi.fn();
  export let placeholder: string | undefined = undefined;

  const handleChange = (event: CustomEvent<string>) => {
    onChange(event.detail);
  };
</script>

<SelectField {defaultOpen} {items} {noResultsMessage} {placeholder} on:change={handleChange} />
