import type { ToolboxWebsiteConfig } from '../toolbox.types';

export function createWhatsappConfig(): ToolboxWebsiteConfig {
  return {
    host: 'web.whatsapp.com',
    style: 'flat',
    inject: {
      parent: '#main',
      insertBefore: '[data-testid="conversation-panel-body"]+div',
    },
    input: {
      selector: '[data-testid="conversation-compose-box-input"]',
      type: 'editable',
    },
    createRootElement() {
      const root = document.createElement('div');
      root.style.order = '2';
      root.style.zIndex = '1';

      return root;
    },
  };
}
