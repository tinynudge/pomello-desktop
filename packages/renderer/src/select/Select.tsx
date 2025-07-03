import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { useServiceResource } from '@/shared/context/ServiceContext';
import { SelectItem, SelectOptionType } from '@pomello-desktop/domain';
import { Show, batch, createSignal, onCleanup } from 'solid-js';
import styles from './Select.module.scss';
import { DropdownList } from './components/DropdownList';
import { DropdownRow } from './components/DropdownRow';
import { FilterInput } from './components/FilterInput';
import { findFirstOption, findLastOption, findNearestOption } from './helpers/findOption';
import { useEnsureVisibleActiveOption } from './hooks/useEnsureVisibleActiveOption';
import { useFilterItems } from './hooks/useFilterItems';
import { useUpdateWindowDimensions } from './hooks/useUpdateWindowDimensions';

export const Select = () => {
  const serviceResource = useServiceResource();
  const settings = useSettings();
  const t = useTranslate();

  const [getIsVisible, setIsVisible] = createSignal(false);
  const [getActiveOptionId, setActiveOptionId] = createSignal<string>();
  const [getQuery, setQuery] = createSignal('');
  const [getItems, setItems] = createSignal<SelectItem[]>([]);
  const [getPlaceholder, setPlaceholder] = createSignal<string>();
  const [getNoResultsMessage, setNoResultsMessage] = createSignal<string>();

  const getFilteredItems = useFilterItems(getQuery, getItems);

  useEnsureVisibleActiveOption({
    getActiveOptionId,
    getInputRef: () => inputRef,
    getItems: getFilteredItems,
    getListRef: () => listRef,
    setActiveOptionId,
  });

  useUpdateWindowDimensions({
    getContainer: () => listRef,
    getIsVisible,
    getItems: getFilteredItems,
    maxRows: settings.selectMaxRows,
  });

  const removeOnSetSelectItems = window.app.onSetSelectItems(
    ({ items, noResultsMessage, placeholder }) => {
      batch(() => {
        setItems(items);
        setNoResultsMessage(noResultsMessage);
        setPlaceholder(placeholder);
      });

      if (placeholder) {
        // Update the title so screen readers have more context.
        document.title = placeholder;
      }
    }
  );

  const removeOnShowSelect = window.app.onShowSelect(() => {
    setIsVisible(true);

    inputRef.focus();
  });

  const removeOnSelectHide = window.app.onSelectHide(() => {
    setIsVisible(false);

    batch(() => {
      setQuery('');
      setActiveOptionId(undefined);
    });
  });

  const removeOnSelectReset = window.app.onSelectReset(() => {
    setIsVisible(false);

    batch(() => {
      setQuery('');
      setItems([]);
      setActiveOptionId(undefined);
      setPlaceholder(undefined);
      setNoResultsMessage(undefined);
    });
  });

  onCleanup(() => {
    removeOnSetSelectItems();
    removeOnShowSelect();
    removeOnSelectHide();
    removeOnSelectReset();
  });

  const highlightAdjacentOption = (direction: 'next' | 'previous') => {
    const option = findNearestOption({
      activeOptionId: getActiveOptionId(),
      container: listRef,
      direction,
    });

    if (option) {
      setActiveOptionId(option.id);
    }
  };

  const selectActiveOption = () => {
    const currentActiveOptionId = getActiveOptionId();

    if (currentActiveOptionId) {
      window.app.selectOption(currentActiveOptionId);
    }
  };

  const handleOptionHover = (option: SelectOptionType) => {
    setActiveOptionId(option.id);
  };

  const handleOptionSelect = () => {
    selectActiveOption();
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  const handleInputEnter = () => {
    selectActiveOption();
  };

  const handleInputEscape = () => {
    window.app.hideSelect();
  };

  const handleFirstOptionSelect = () => {
    const option = findFirstOption(listRef);

    if (option) {
      setActiveOptionId(option.id);
    }
  };

  const handleLastOptionSelect = () => {
    const option = findLastOption(listRef);

    if (option) {
      setActiveOptionId(option.id);
    }
  };

  const handleNextOptionSelect = () => {
    highlightAdjacentOption('next');
  };

  const handlePreviousOptionSelect = () => {
    highlightAdjacentOption('previous');
  };

  let listRef!: HTMLUListElement;
  let inputRef!: HTMLInputElement;

  const listboxId = 'select-listbox';

  return (
    <>
      <FilterInput
        activeOptionId={getActiveOptionId()}
        listboxId={listboxId}
        onChange={handleInputChange}
        onEnter={handleInputEnter}
        onEscape={handleInputEscape}
        onFirstOptionSelect={handleFirstOptionSelect}
        onLastOptionSelect={handleLastOptionSelect}
        onNextOptionSelect={handleNextOptionSelect}
        onPreviousOptionSelect={handlePreviousOptionSelect}
        placeholder={getPlaceholder() ?? t('selectPlaceholder')}
        query={getQuery()}
        ref={inputRef}
      />
      <DropdownList
        activeOptionId={getActiveOptionId()}
        depth={0}
        id={listboxId}
        items={serviceResource.state !== 'ready' ? [] : getFilteredItems()}
        onOptionHover={handleOptionHover}
        onOptionSelect={handleOptionSelect}
        ref={listRef}
        role="listbox"
        service={serviceResource.latest?.service}
      >
        <Show when={getFilteredItems().length === 0}>
          <DropdownRow class={styles.noResults} role="alert">
            {getQuery() ? t('selectNoMatchesFound') : t(getNoResultsMessage() ?? 'selectNoResults')}
          </DropdownRow>
        </Show>
      </DropdownList>
    </>
  );
};
