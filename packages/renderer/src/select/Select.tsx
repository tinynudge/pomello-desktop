import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem, SelectOptionType, ServiceRegistry, Settings } from '@domain';
import { FC, useEffect, useRef, useState } from 'react';
import DropdownList from './components/DropdownList';
import DropdownRow from './components/DropdownRow';
import FilterInput from './components/FilterInput';
import findFirstOption from './helpers/findFirstOption';
import findLastOption from './helpers/findLastOption';
import findNearestOption from './helpers/findNearestOption';
import useFilterItems from './hooks/useFilterItems';
import useUpdateWindowDimensions from './hooks/useUpdateWindowDimensions';
import styles from './Select.module.scss';

interface SelectProps {
  services: ServiceRegistry;
  settings: Settings;
}

const Select: FC<SelectProps> = ({ services, settings }) => {
  const { t } = useTranslation();

  const listRef = useRef<HTMLUListElement>(null);

  const [serviceId, setServiceId] = useState<string>();
  const service = useService(services, serviceId);

  const [activeOptionId, setActiveOptionId] = useState<string>();

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SelectItem[]>([]);
  const filteredItems = useFilterItems(query, items);

  const [placeholder, setPlaceholder] = useState<string>();

  useUpdateWindowDimensions({
    container: listRef.current,
    items: filteredItems,
    maxRows: settings.selectMaxRows,
  });

  useEffect(() => {
    return window.app.onSelectShow(({ serviceId, placeholder, items }) => {
      setServiceId(serviceId);
      setPlaceholder(placeholder);
      setItems(items);
    });
  }, []);

  const handleOptionHover = (option: SelectOptionType) => {
    setActiveOptionId(option.id);
  };

  const handleOptionSelect = () => {
    if (activeOptionId) {
      window.app.selectOption(activeOptionId);
    }
  };

  const handleFirstOptionSelect = () => {
    const option = findFirstOption(listRef.current);

    if (option) {
      setActiveOptionId(option.id);
    }
  };

  const handleLastOptionSelect = () => {
    const option = findLastOption(listRef.current);

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

  const highlightAdjacentOption = (direction: 'next' | 'previous') => {
    const option = findNearestOption({ activeOptionId, container: listRef.current, direction });

    if (option) {
      setActiveOptionId(option.id);
    }
  };

  const listboxId = 'select-listbox';

  return (
    <>
      <FilterInput
        activeOptionId={activeOptionId}
        listboxId={listboxId}
        onChange={setQuery}
        onFirstOptionSelect={handleFirstOptionSelect}
        onLastOptionSelect={handleLastOptionSelect}
        onNextOptionSelect={handleNextOptionSelect}
        onPreviousOptionSelect={handlePreviousOptionSelect}
        placeholder={placeholder ?? t('selectPlaceholder')}
        query={query}
      />
      <DropdownList
        activeOptionId={activeOptionId}
        depth={0}
        id={listboxId}
        items={filteredItems}
        onOptionHover={handleOptionHover}
        onOptionSelect={handleOptionSelect}
        ref={listRef}
        role="listbox"
        service={service}
      >
        {query && filteredItems.length === 0 && (
          <DropdownRow className={styles.noResults} role="alert">
            {t('selectNoResults')}
          </DropdownRow>
        )}
      </DropdownList>
    </>
  );
};

export default Select;
