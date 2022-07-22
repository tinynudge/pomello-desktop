import { selectServiceId } from '@/app/appSlice';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface SelectFieldProps {
  items: SelectItem[];
  placeholder?: string;
  onChange(optionId: string): void;
}

const SelectField: FC<SelectFieldProps> = ({ items, placeholder: customPlaceholder, onChange }) => {
  const { t } = useTranslation();

  const serviceId = useSelector(selectServiceId);

  const placeholder = customPlaceholder ?? t('selectPlaceholder');

  useEffect(() => {
    const removeSelectOptionListener = window.app.onSelectChange(onChange);

    return () => {
      removeSelectOptionListener();
    };
  }, [onChange]);

  useEffect(() => {
    window.app.showSelect({ serviceId, placeholder, items });
  }, [placeholder, items, serviceId]);

  return <div>{placeholder}</div>;
};

export default SelectField;
