import createStore from '@/shared/helpers/createStore';
import useInitializeService from '@/shared/hooks/useInitializeService';
import useTranslation from '@/shared/hooks/useTranslation';
import { Logger, SelectItem, SelectOptionType, ServiceRegistry, Settings } from '@domain';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Select.module.scss';
import DropdownList from './components/DropdownList';
import DropdownRow from './components/DropdownRow';
import FilterInput from './components/FilterInput';
import findFirstOption from './helpers/findFirstOption';
import findLastOption from './helpers/findLastOption';
import findNearestOption from './helpers/findNearestOption';
import useEnsureVisibleActiveOption from './hooks/useEnsureVisibleActiveOption';
import useFilterItems from './hooks/useFilterItems';
import useUpdateWindowDimensions from './hooks/useUpdateWindowDimensions';

interface SelectProps {
  initialServiceId?: string;
  logger: Logger;
  services: ServiceRegistry;
  settings: Settings;
}

const Select: FC<SelectProps> = ({ initialServiceId, logger, services, settings }) => {
  const { t } = useTranslation();

  const listRef = useRef<HTMLUListElement>(null);

  const [serviceId, setServiceId] = useState(initialServiceId);
  const { activeService, status } = useInitializeService({ logger, services, serviceId });

  useEffect(() => {
    return window.app.onServicesChange(services => {
      setServiceId(services.activeServiceId);
    });
  }, []);

  const isReady = useRef(false);
  const activeOptionId = useMemo(() => createStore<string>(), []);

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SelectItem[]>([]);
  const filteredItems = useFilterItems(query, items);

  const [placeholder, setPlaceholder] = useState<string>();
  const [noResultsMessage, setNoResultsMessage] = useState<string>();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputHeight = useRef(0);
  const inputCallbackRef = useCallback((inputElement: HTMLInputElement | null) => {
    if (inputElement) {
      const { height } = inputElement.getBoundingClientRect();

      inputRef.current = inputElement;
      inputHeight.current = height;
    }
  }, []);

  useEnsureVisibleActiveOption({
    activeOptionId,
    inputHeight,
    items: filteredItems,
    listRef,
  });

  useEffect(() => {
    return window.app.onShowSelect(() => {
      inputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const tick = () => new Promise<void>(resolve => resolve());

    return window.app.onSelectHide(async () => {
      setQuery('');

      await tick();

      activeOptionId.set(undefined);
    });
  }, [activeOptionId]);

  useEffect(() => {
    return window.app.onSelectReset(() => {
      isReady.current = false;
      activeOptionId.set(undefined);

      setQuery('');
      setPlaceholder(undefined);
      setNoResultsMessage(undefined);
    });
  }, [activeOptionId]);

  useEffect(() => {
    return window.app.onSetSelectItems(({ items, noResultsMessage, placeholder }) => {
      setItems(items);
      setNoResultsMessage(noResultsMessage);
      setPlaceholder(placeholder);

      if (placeholder) {
        // Update the title so screen readers have more context.
        document.title = placeholder;
      }
    });
  }, []);

  const selectActiveOption = useCallback(() => {
    const currentActiveOptionId = activeOptionId.get();

    if (currentActiveOptionId) {
      window.app.selectOption(currentActiveOptionId);
    }
  }, [activeOptionId]);

  const handleDimensionsUpdate = useCallback(() => {
    if (isReady.current) {
      return;
    }

    isReady.current = true;
  }, []);

  const handleOptionHover = useCallback(
    (option: SelectOptionType) => {
      activeOptionId.set(option.id);
    },
    [activeOptionId]
  );

  const handleOptionSelect = useCallback(() => {
    selectActiveOption();
  }, [selectActiveOption]);

  useUpdateWindowDimensions({
    container: listRef.current,
    items: filteredItems,
    maxRows: settings.selectMaxRows,
    onUpdate: handleDimensionsUpdate,
  });

  const handleInputEnter = () => {
    selectActiveOption();
  };

  const handleInputEscape = () => {
    window.app.hideSelect();
  };

  const handleFirstOptionSelect = () => {
    const option = findFirstOption(listRef.current);

    if (option) {
      activeOptionId.set(option.id);
    }
  };

  const handleLastOptionSelect = () => {
    const option = findLastOption(listRef.current);

    if (option) {
      activeOptionId.set(option.id);
    }
  };

  const handleNextOptionSelect = () => {
    highlightAdjacentOption('next');
  };

  const handlePreviousOptionSelect = () => {
    highlightAdjacentOption('previous');
  };

  const highlightAdjacentOption = (direction: 'next' | 'previous') => {
    const option = findNearestOption({
      activeOptionId: activeOptionId.get(),
      container: listRef.current,
      direction,
    });

    if (option) {
      activeOptionId.set(option.id);
    }
  };

  const listboxId = 'select-listbox';

  return (
    <>
      <FilterInput
        activeOptionId={activeOptionId}
        listboxId={listboxId}
        onChange={setQuery}
        onEnter={handleInputEnter}
        onEscape={handleInputEscape}
        onFirstOptionSelect={handleFirstOptionSelect}
        onLastOptionSelect={handleLastOptionSelect}
        onNextOptionSelect={handleNextOptionSelect}
        onPreviousOptionSelect={handlePreviousOptionSelect}
        placeholder={placeholder ?? t('selectPlaceholder')}
        ref={inputCallbackRef}
        query={query}
      />
      <DropdownList
        activeOptionId={activeOptionId}
        depth={0}
        id={listboxId}
        items={status === 'INITIALIZING' ? [] : filteredItems}
        onOptionHover={handleOptionHover}
        onOptionSelect={handleOptionSelect}
        ref={listRef}
        role="listbox"
        service={activeService?.service}
      >
        {filteredItems.length === 0 && (
          <DropdownRow className={styles.noResults} role="alert">
            {Boolean(query) ? t('selectNoMatchesFound') : t(noResultsMessage ?? 'selectNoResults')}
          </DropdownRow>
        )}
      </DropdownList>
    </>
  );
};

export default Select;
