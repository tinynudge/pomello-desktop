import MockSelectField from '@/app/ui/__fixtures__/MockSelectField.svelte';
import mountComponent, { type MountComponentOptions } from '@/app/ui/__fixtures__/mountComponent';
import type { ComponentProps } from 'svelte';
import html from 'svelte-htm';

export * from '@/app/ui/__fixtures__/mountComponent';

const mountSelectField = (
  props: ComponentProps<MockSelectField> = {},
  options: MountComponentOptions = {}
) => {
  return mountComponent(html`<${MockSelectField} ...${props} />`, options);
};

export default mountSelectField;
