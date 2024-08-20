import 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface CSSProperties {
      'anchor-name'?: string;
      'position-anchor'?: string;
    }
  }
}
