import type { ComponentProps } from 'svelte';
import html from 'svelte-htm';
import mountComponent, { type MountComponentOptions } from '../../__fixtures__/mountComponent';
import MockSelectField from './MockSelectField.svelte';

export * from '../../__fixtures__/mountComponent';

const mountSelectField = (
  props: ComponentProps<MockSelectField> = {},
  options: MountComponentOptions = {}
) => {
  return mountComponent(html`<${MockSelectField} ...${props} />`, options);
};

export default mountSelectField;
