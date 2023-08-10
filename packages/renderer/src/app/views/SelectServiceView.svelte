<script lang="ts">
  import getTranslator from '@/app/helpers/getTranslator';
  import Content from '@/app/ui/Content.svelte';
  import Heading from '@/app/ui/Heading.svelte';
  import SelectField from '@/app/ui/SelectField.svelte';
  import type { SelectItem, ServiceRegistry } from '@domain';

  export let services: ServiceRegistry;

  const translate = getTranslator();

  const handleServiceChange = (event: CustomEvent<string>) => {
    window.app.setActiveServiceId(event.detail);
  };

  const items: SelectItem[] = Object.keys(services).map(serviceId => ({
    id: serviceId,
    label: services[serviceId].displayName,
  }));
</script>

<Content>
  <Heading>{$translate('selectServiceHeading')}</Heading>
  <SelectField
    {items}
    on:change={handleServiceChange}
    placeholder={$translate('selectServiceLabel')}
  />
</Content>
