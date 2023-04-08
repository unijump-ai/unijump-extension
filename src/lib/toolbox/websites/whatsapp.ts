import { sleep } from '$lib/utils';
import type { ToolboxWebsiteConfig, ToolboxWebsitePlugin } from '../toolbox.types';

export function createWhatsappConfig(): ToolboxWebsiteConfig {
  return {
    name: 'Whatsapp',
    host: 'web.whatsapp.com',
    inject: {
      insertBefore: '[data-testid="conversation-panel-body"]+div',
    },
    input: {
      selector: '[data-testid="conversation-compose-box-input"]',
    },
    plugins: [whatsAppContainerPlugin()],
  };
}

function whatsAppContainerPlugin(): ToolboxWebsitePlugin {
  return {
    beforeMount(toolbox) {
      const container = document.createElement('div');
      container.style.order = '2';
      container.style.zIndex = '2';

      toolbox.setContainer(container);
    },
    async afterMount() {
      await sleep(200);
      const messagesNode = document.querySelector(
        '[data-testid="conversation-panel-messages"]'
      );

      if (!messagesNode) {
        return;
      }

      messagesNode.scrollTop = messagesNode.scrollHeight;
    },
  };
}
