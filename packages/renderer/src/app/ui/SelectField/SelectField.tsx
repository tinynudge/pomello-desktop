import { selectServiceId } from '@/app/appSlice';
import { SelectItem } from '@domain';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface SelectFieldProps {
  items: SelectItem[];
  onChange(optionId: string): void;
}

const SelectField: FC<SelectFieldProps> = ({ items, onChange }) => {
  const serviceId = useSelector(selectServiceId);

  useEffect(() => {
    const removeSelectOptionListener = window.app.onSelectChange(onChange);

    return () => {
      removeSelectOptionListener();
    };
  }, [onChange]);

  useEffect(() => {
    window.app.showSelect({ serviceId, items });
  }, [items, serviceId]);

  return <div>Select</div>;
};

export default SelectField;
