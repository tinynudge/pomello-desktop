<script lang="ts">
  import type { TranslationsDictionary } from '@domain';
  import type { PomelloService } from '@tinynudge/pomello-service';
  import { setTranslationsContext } from './translationsContext';

  export let pomelloService: PomelloService;
  export let translations: TranslationsDictionary;

  setTranslationsContext(translations);
</script>

<pre>{JSON.stringify(pomelloService.getState())}</pre>
