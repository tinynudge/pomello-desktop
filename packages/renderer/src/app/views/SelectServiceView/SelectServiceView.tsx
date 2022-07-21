import { serviceChange } from '@/app/appSlice';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem, ServiceRegistry } from '@domain';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

interface SelectServiceViewProps {
  services: ServiceRegistry;
}

const SelectServiceView: FC<SelectServiceViewProps> = ({ services }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleServiceChange = (serviceId: string) => {
    dispatch(serviceChange(serviceId));
  };

  const items: SelectItem[] = Object.keys(services).map(serviceId => ({
    id: serviceId,
    label: serviceId,
  }));

  return (
    <>
      <Heading>{t('selectServiceHeading')}</Heading>
      <SelectField onChange={handleServiceChange} items={items} />
    </>
  );
};

export default SelectServiceView;
