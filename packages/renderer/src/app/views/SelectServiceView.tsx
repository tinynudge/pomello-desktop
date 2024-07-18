import { useRuntime, useTranslate } from '@/shared/context/RuntimeContext';
import { Content } from '@/ui/app/Content';
import { Heading } from '@/ui/app/Heading';
import { SelectField } from '@/ui/app/SelectField';
import { SelectItem } from '@pomello-desktop/domain';
import { Component } from 'solid-js';

export const SelectServiceView: Component = () => {
  const { services } = useRuntime();
  const t = useTranslate();

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
