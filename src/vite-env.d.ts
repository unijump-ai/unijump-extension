/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="@samrum/vite-plugin-web-extension/client" />

declare module '*svg?component' {
  import { ComponentType, SvelteComponentTyped } from 'svelte';

  interface SvgProps {
    width?: number | string;
    height?: number | string;
  }

  const icon: ComponentType<SvelteComponentTyped<SvgProps>>;
  export default icon;
}

declare module '*&imagetools' {
  export default ImageToolsImage;
}

declare module '*&picture&imagetools' {
  import { ImageToolsSource } from './image-tools';

  export default ImageToolsSource;
}
