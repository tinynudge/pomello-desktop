import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC } from 'react';

interface SelectListViewProps {
  lists: SelectItem[];
  onListSelect(listId: string): void;
}

const SelectListView: FC<SelectListViewProps> = ({ lists, onListSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectField
      items={lists}
      onChange={onListSelect}
      placeholder={t('service:selectListPlaceholder')}
    />
  );
};

export default SelectListView;
