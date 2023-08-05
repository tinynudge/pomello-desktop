<script lang="ts">
  import getTranslator from '@/app/getTranslator';
  import filterItems from '@/select/helpers/filterItems';
  import selectOptions from '@/select/helpers/selectOptions';
  import { setTranslationsContext } from '@/shared/contexts/translationsContext';
  import initializeService from '@/shared/helpers/initializeService';
  import type {
    Logger,
    SelectItem,
    ServiceRegistry,
    Settings,
    TranslationsDictionary,
  } from '@domain';
  import { onMount } from 'svelte';
  import DropdownList from './components/DropdownList.svelte';
  import FilterInput from './components/FilterInput.svelte';
  import findFirstOption from './helpers/findFirstOption';
  import findLastOption from './helpers/findLastOption';
  import findNearestOption from './helpers/findNearestOption';
  import updateWindowDimensions from './updateWindowDimensions';

  export let initialServiceId: string | undefined;
  export let logger: Logger;
  export let services: ServiceRegistry;
  export let settings: Settings;
  export let translations: TranslationsDictionary;

  setTranslationsContext(translations);

  const initializeServiceResult = initializeService({ initialServiceId, logger, services });
  const listboxId = 'select-listbox';
  const translate = getTranslator();

  let activeOptionId: string | undefined;
  let filteredItems: SelectItem[] = [];
  let inputElement: HTMLInputElement | undefined;
  let listElement: HTMLDivElement | undefined;
  let orientation: 'bottom' | 'top' | undefined;
  let query = '';
  let shouldUpdateWidth = false;

  $: ({ activeService, status } = $initializeServiceResult);

  $: ({ items, noResultsMessage, placeholder } = $selectOptions);

  $: if (status === 'READY') {
    filteredItems = filterItems(items, query);

    updateWindowDimensions({
      container: listElement,
      maxRows: settings.selectMaxRows,
      orientation,
      shouldUpdateWidth,
    });

    shouldUpdateWidth = false;
  }

  $: noItemsMessage = query
    ? $translate('selectNoMatchesFound')
    : $translate(noResultsMessage ?? 'selectNoResults');

  selectOptions.subscribe(() => {
    shouldUpdateWidth = true;
  });

  onMount(() => {
    const onSelectShowUnsubscribe = window.app.onSelectShow(options => {
      orientation = options.orientation;

      document.documentElement.classList.remove('visibly-hidden');
      inputElement?.focus();
    });

    const onHideSelectUnsubscribe = window.app.onSelectHide(async () => {
      document.documentElement.classList.add('visibly-hidden');

      activeOptionId = undefined;
      query = '';
    });

    return () => {
      onSelectShowUnsubscribe();
      onHideSelectUnsubscribe();
    };
  });

  const handleInputEnter = () => {
    selectActiveOption();
  };

  const handleInputEscape = () => {
    window.app.hideSelect();
  };

  const handleFirstOptionSelect = () => {
    const option = findFirstOption(listElement);

    if (option) {
      activeOptionId = option.id;
    }
  };

  const handleLastOptionSelect = () => {
    const option = findLastOption(listElement);

    if (option) {
      activeOptionId = option.id;
    }
  };

  const handleNextOptionSelect = () => {
    highlightAdjacentOption('next');
  };

  const handlePreviousOptionSelect = () => {
    highlightAdjacentOption('previous');
  };

  const handleOptionHover = (event: CustomEvent<string>) => {
    activeOptionId = event.detail;
  };

  const handleOptionSelect = (event: CustomEvent<string>) => {
    activeOptionId = event.detail;

    selectActiveOption();
  };

  const highlightAdjacentOption = (direction: 'next' | 'previous') => {
    const option = findNearestOption({
      activeOptionId,
      container: listElement,
      direction,
    });

    if (option) {
      activeOptionId = option.id;
    }
  };

  const selectActiveOption = () => {
    if (activeOptionId) {
      window.app.selectChange(activeOptionId);
    }
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
  {noItemsMessage}
  bind:listElement
  depth={0}
  id={listboxId}
  items={filteredItems}
  on:hover={handleOptionHover}
  on:select={handleOptionSelect}
  role="listbox"
  service={activeService?.service}
/>

<style lang="scss">
  :global(body) {
    background-color: var(--select-background-default);
    color: var(--select-content-default);
    user-select: none;
  }

  :global(html.visibly-hidden) {
    visibility: hidden;
  }

  :global(.actual-width) {
    display: inline-block;
  }
</style>
