<script lang="ts">
  import getTranslator from '@/app/getTranslator';
  import filterItems from '@/select/helpers/filterItems';
  import selectOptions from '@/select/helpers/selectOptions';
  import { setTranslationsContext } from '@/shared/contexts/translationsContext';
  import initializeService from '@/shared/helpers/initializeService';
  import type { Logger, ServiceRegistry, TranslationsDictionary } from '@domain';
  import { onMount } from 'svelte';
  import DropdownList from './components/DropdownList.svelte';
  import DropdownRow from './components/DropdownRow.svelte';
  import FilterInput from './components/FilterInput.svelte';

  export let initialServiceId: string | undefined;
  export let logger: Logger;
  export let services: ServiceRegistry;
  export let translations: TranslationsDictionary;

  setTranslationsContext(translations);

  const initializeServiceResult = initializeService({ initialServiceId, logger, services });
  const listboxId = 'select-listbox';
  const translate = getTranslator();

  let activeOptionId: string | undefined = undefined;
  let inputElement: HTMLInputElement | null = null;
  let listElement: HTMLDivElement | undefined = undefined;
  let query = '';

  $: ({ activeService, status } = $initializeServiceResult);

  $: ({ items, noResultsMessage, placeholder } = $selectOptions);

  $: filteredItems = status === 'INITIALIZING' ? [] : filterItems(items, query);

  onMount(() => {
    return window.app.onShowSelect(() => {
      inputElement?.focus();
    });
  });

  const handleInputEnter = () => {
    console.log('inputEnter', listElement);
  };

  const handleInputEscape = () => {
    console.log('inputEscape');
  };

  const handleFirstOptionSelect = () => {
    console.log('firstOptionSelect');
  };

  const handleLastOptionSelect = () => {
    console.log('lastOptionSelect');
  };

  const handleNextOptionSelect = () => {
    console.log('nextOptionSelect');
  };

  const handlePreviousOptionSelect = () => {
    console.log('previousOptionSelect');
  };

  const handleOptionHover = (event: CustomEvent<string>) => {
    activeOptionId = event.detail;
  };

  const handleOptionSelect = (event: CustomEvent<string>) => {
    console.log('select', event.detail);
  };
</script>

<FilterInput
  {listboxId}
  bind:inputElement
  bind:query
  on:firstOptionSelect={handleFirstOptionSelect}
  on:inputEnter={handleInputEnter}
  on:inputEscape={handleInputEscape}
  on:lastOptionSelect={handleLastOptionSelect}
  on:nextOptionSelect={handleNextOptionSelect}
  on:previousOptionSelect={handlePreviousOptionSelect}
  placeholder={placeholder ?? $translate('selectPlaceholder')}
/>
<DropdownList
  {activeOptionId}
  bind:listElement
  depth={0}
  id={listboxId}
  items={filteredItems}
  on:hover={handleOptionHover}
  on:select={handleOptionSelect}
  role="listbox"
  service={activeService?.service}
>
  {#if filteredItems.length === 0}
    <DropdownRow isDisabled role="alert">
      {query
        ? $translate('selectNoMatchesFound')
        : $translate(noResultsMessage ?? 'selectNoResults')}
    </DropdownRow>
  {/if}
</DropdownList>

<style lang="scss">
  :global(body) {
    background-color: var(--select-background-default);
    color: var(--select-content-default);
    user-select: none;
  }
</style>
