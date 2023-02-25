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

declare module '*&image' {
  import { ImageToolsImage } from './types/image-tools';

  export default ImageToolsImage;
}

declare module '*&picture' {
  import { ImageToolsSource } from './types/image-tools';

  export default ImageToolsSource;
}

interface ImportMetaEnv {
  readonly CLIENT_AMPLITUDE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
