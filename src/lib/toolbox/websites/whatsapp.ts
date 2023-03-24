import type { ToolboxWebsiteConfig } from '../toolbox.types';

export function createWhatsappConfig(): ToolboxWebsiteConfig {
  const inputSelector = '[data-testid="conversation-compose-box-input"]';

  return {
    host: 'web.whatsapp.com',
    style: 'flat',
    disabled: false,
    waitFor: inputSelector,
    inject: { parent: '#main', insertBefore: 'footer' },
    createRootElement() {
      const root = document.createElement('div');
      root.style.order = '3';
      root.style.zIndex = '1';

      return root;
    },
    getValue() {
      const input = document.querySelector(inputSelector) as HTMLDivElement;

      if (!input) return '';

      return input.innerText.trim();
    },
  };
}
