declare module '*.svg' {
  import type { Component, ComponentProps } from 'solid-js';

  const svgComponent: Component<ComponentProps<'svg'>>;

  export default svgComponent;
}
