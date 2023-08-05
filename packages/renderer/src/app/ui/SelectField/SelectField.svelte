<script lang="ts">
  import getTranslator from '@/app/getTranslator';
  import type { SelectItem } from '@domain';
  import { createEventDispatcher, onMount } from 'svelte';

  let customPlaceholder: string | undefined = undefined;
  export let defaultOpen = false;
  export let items: SelectItem[];
  export let noResultsMessage: string | undefined = undefined;
  export { customPlaceholder as placeholder };

  const dispatch = createEventDispatcher<{ change: string }>();
  const translate = getTranslator();

  let buttonElement: HTMLButtonElement | undefined = undefined;
  let shouldOpenOnUpdate = defaultOpen;

  $: placeholder = customPlaceholder ?? $translate('selectPlaceholder');

  $: {
    window.app.setSelectItems({ items, noResultsMessage, placeholder });

    // This is much simpler than doing a lot of message passing to figure out if
    // the select window has updated.
    if (shouldOpenOnUpdate) {
      setTimeout(showSelectWindow, 5);
    }

    shouldOpenOnUpdate = false;
  }

  onMount(() => {
    const onSelectChangeUnsubscribe = window.app.onSelectChange(optionId => {
      dispatch('change', optionId);
    });

    return () => {
      onSelectChangeUnsubscribe();
      window.app.resetSelect();
    };
  });

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' && event.target === document.body) {
      showSelectWindow();
    }
  };

  const handleButtonClick = () => {
    showSelectWindow();
  };

  const showSelectWindow = () => {
    if (buttonElement) {
      const bounds = buttonElement.getBoundingClientRect();

      window.app.showSelect({
        buttonBounds: {
          height: bounds.height,
          width: bounds.width,
          x: bounds.x,
          y: bounds.y,
        },
      });
    }
  };
</script>

<svelte:document on:keydown={handleDocumentKeyDown} />

<button bind:this={buttonElement} class="button" on:click={handleButtonClick}>
  {placeholder}
</button>

<style lang="scss">
  $button-padding: 2px;

  .button {
    position: relative;
    padding: 0 $button-padding;
    border: 0;
    margin-left: -$button-padding;
    background-color: transparent;
    color: inherit;

    &::after {
      position: absolute;
      bottom: 0;
      display: block;
      width: calc(100% - ($button-padding * 2));
      border-bottom: 1px dotted var(--app-content-default);
      content: '';
      opacity: 0;
      transition: opacity 140ms ease-in-out;
    }

    &:hover {
      cursor: pointer;

      &::after {
        opacity: 0.8;
      }
    }
  }
</style>
