<script lang="ts">
  import { setServiceContext } from '@/app/contexts/serviceContext';
  import type { Service } from '@domain';

  export let service: Service;

  setServiceContext(service);
</script>

<slot />
