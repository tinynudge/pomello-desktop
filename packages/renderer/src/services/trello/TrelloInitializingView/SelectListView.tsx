import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC } from 'react';

interface SelectListViewProps {
  defaultOpen: boolean;
  lists: SelectItem[];
  onListSelect(listId: string): void;
}

const SelectListView: FC<SelectListViewProps> = ({ defaultOpen, lists, onListSelect }) => {
  const { t } = useTranslation();

  return (
    <SelectField
      defaultOpen={defaultOpen}
      items={lists}
      onChange={onListSelect}
      placeholder={t('service:selectListPlaceholder')}
    />
  );
};

export default SelectListView;
