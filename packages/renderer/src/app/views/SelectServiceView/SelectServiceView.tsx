import Content from '@/app/ui/Content';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem, ServiceRegistry } from '@domain';
import { FC } from 'react';

interface SelectServiceViewProps {
  services: ServiceRegistry;
}

const SelectServiceView: FC<SelectServiceViewProps> = ({ services }) => {
  const { t } = useTranslation();

  const handleServiceChange = (serviceId: string) => {
    window.app.setActiveServiceId(serviceId);
  };

  const items: SelectItem[] = Object.keys(services).map(serviceId => ({
    id: serviceId,
    label: services[serviceId].displayName,
  }));

  return (
    <Content>
      <Heading>{t('selectServiceHeading')}</Heading>
      <SelectField
        onChange={handleServiceChange}
        placeholder={t('selectServiceLabel')}
        items={items}
      />
    </Content>
  );
};

export default SelectServiceView;
