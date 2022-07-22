import useService from '@/shared/hooks/useService';
import { SelectItem, SelectOptionType, ServiceRegistry, Settings } from '@domain';
import { FC, useEffect, useState } from 'react';
import DropdownList from './components/DropdownList';
import './Select.module.scss';

interface SelectProps {
  services: ServiceRegistry;
  settings: Settings;
}

const Select: FC<SelectProps> = ({ services }) => {
  const [serviceId, setServiceId] = useState<string>();
  const service = useService(services, serviceId);

  const [items, setItems] = useState<SelectItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOptionType>();

  useEffect(() => {
    const removeSelectShowListener = window.app.onSelectShow(({ serviceId, items }) => {
      setServiceId(serviceId);
      setItems(items);
    });

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

  return (
    <>
      <DropdownList
        depth={0}
        items={items}
        onOptionHover={handleOptionHover}
        onOptionSelect={handleOptionSelect}
        role="listbox"
        selectedOption={selectedOption}
        service={service}
      />
    </>
  );
};

export default Select;
