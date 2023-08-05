<script lang="ts">
  import { setTranslationsContext } from '@/shared/contexts/translationsContext';
  import type { TranslationsDictionary } from '@domain';

  export let translations: TranslationsDictionary;

  setTranslationsContext(translations);
</script>

<slot />
