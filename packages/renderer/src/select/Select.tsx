import useService from '@/shared/hooks/useService';
import { SelectItem, SelectOptionType, ServiceRegistry, Settings } from '@domain';
import { FC, useEffect, useState } from 'react';
import DropdownList from './components/DropdownList/DropdownList';

interface SelectProps {
  services: ServiceRegistry;
  settings: Settings;
}

const Select: FC<SelectProps> = ({ services }) => {
  const [serviceId, setServicecId] = useState<string>();
  const [items, setItems] = useState<SelectItem[]>([]);

  const service = useService(services, serviceId);

  useEffect(() => {
    const removeSelectShowListener = window.app.onSelectShow(({ serviceId, items }) => {
      setServicecId(serviceId);
      setItems(items);
    });

    return () => {
      removeSelectShowListener();
    };
  }, []);

  const handleOptionSelect = (option: SelectOptionType) => {
    window.app.selectOption(option);
  };

  return (
    <>
      Select
      <DropdownList depth={0} items={items} onOptionSelect={handleOptionSelect} service={service} />
    </>
  );
};

export default Select;
