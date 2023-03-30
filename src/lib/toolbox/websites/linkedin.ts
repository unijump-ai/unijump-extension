import type { ToolboxWebsiteConfig } from '../toolbox.types';

export function createLinkedinConfig(): ToolboxWebsiteConfig {
  return {
    name: 'Linkedin',
    host: 'www.linkedin.com',
    position: 'top',
    inject: {
      insertBefore: '.share-box-v2__modal-dropzone',
    },
    input: {
      selector: '.ql-editor',
    },
  };
}
