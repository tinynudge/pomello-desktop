<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let activeOptionId: string | undefined = undefined;
  export let inputElement: HTMLInputElement | null = null;
  export let listboxId: string;
  export let placeholder: string;
  export let query: string;

  const dispatch = createEventDispatcher<{
    firstOptionSelect: null;
    inputEnter: null;
    inputEscape: null;
    lastOptionSelect: null;
    nextOptionSelect: null;
    previousOptionSelect: null;
  }>();

  const handleInputKeyDown = (event: KeyboardEvent) => {
    const { key, shiftKey } = event;

    if (key === 'Tab') {
      event.preventDefault();
    }

    if (key === 'ArrowDown' || (!shiftKey && key === 'Tab')) {
      dispatch('nextOptionSelect');
    } else if (key === 'ArrowUp' || (shiftKey && key === 'Tab')) {
      dispatch('previousOptionSelect');
    } else if (key === 'Home') {
      dispatch('firstOptionSelect');
    } else if (key === 'End') {
      dispatch('lastOptionSelect');
    } else if (key === 'Escape') {
      dispatch('inputEscape');
    } else if (key === 'Enter') {
      dispatch('inputEnter');
    }
  };
</script>

<input
  {placeholder}
  aria-activedescendant={activeOptionId}
  aria-autocomplete="list"
  aria-controls={listboxId}
  aria-expanded
  bind:this={inputElement}
  bind:value={query}
  class="input"
  on:keydown={handleInputKeyDown}
  role="combobox"
  type="text"
/>

<style lang="scss">
  .input {
    position: sticky;
    z-index: 1;
    top: 0;
    width: 100%;
    padding: 12px;
    border: 0;
    border-bottom: 1px solid var(--select-divider);
    background-color: var(--select-background-default);
    color: var(--select-content-default);
    outline: 0;

    &::placeholder {
      color: var(--select-content-helper);
    }
  }
</style>
