import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem, SelectOptionType, ServiceRegistry, Settings } from '@domain';
import { FC, useEffect, useState } from 'react';
import DropdownList from './components/DropdownList';
import DropdownRow from './components/DropdownRow';
import FilterInput from './components/FilterInput';
import useFilterItems from './helpers/useFilterItems';
import styles from './Select.module.scss';

interface SelectProps {
  services: ServiceRegistry;
  settings: Settings;
}

const Select: FC<SelectProps> = ({ services }) => {
  const { t } = useTranslation();

  const [serviceId, setServiceId] = useState<string>();
  const service = useService(services, serviceId);

  const [selectedOption, setSelectedOption] = useState<SelectOptionType>();

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SelectItem[]>([]);
  const filteredItems = useFilterItems(query, items);

  const [placeholder, setPlaceholder] = useState<string>();

  useEffect(() => {
    const removeSelectShowListener = window.app.onSelectShow(
      ({ serviceId, placeholder, items }) => {
        setServiceId(serviceId);
        setPlaceholder(placeholder);
        setItems(items);
      }
    );

    return () => {
      removeSelectShowListener();
    };
  }, []);

  const handleOptionHover = (option: SelectOptionType) => {
    setSelectedOption(option);
  };

  const handleOptionSelect = () => {
    if (selectedOption) {
      window.app.selectOption(selectedOption);
    }
  };

  const listboxId = 'select-listbox';

  return (
    <>
      <FilterInput
        listboxId={listboxId}
        onChange={setQuery}
        placeholder={placeholder ?? t('selectPlaceholder')}
        query={query}
      />
      <DropdownList
        depth={0}
        id={listboxId}
        items={filteredItems}
        onOptionHover={handleOptionHover}
        onOptionSelect={handleOptionSelect}
        role="listbox"
        selectedOption={selectedOption}
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
