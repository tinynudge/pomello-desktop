import { useTranslate } from '@/shared/context/RuntimeContext';
import { SelectField } from '@/ui/app/SelectField';
import { SelectItem } from '@pomello-desktop/domain';
import { Component } from 'solid-js';

type SelectListViewProps = {
  defaultOpen: boolean;
  lists: SelectItem[];
  onListSelect(listId: string): void;
};

export const SelectListView: Component<SelectListViewProps> = props => {
  const t = useTranslate();

  return (
    <SelectField
      defaultOpen={props.defaultOpen}
      items={props.lists}
      onChange={props.onListSelect}
      placeholder={t('service:selectListPlaceholder')}
    />
  );
};
