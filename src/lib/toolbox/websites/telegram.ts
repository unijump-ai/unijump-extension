import type { ToolboxWebsiteConfig } from '../toolbox.types';

export function createTelegramConfig(): ToolboxWebsiteConfig {
  return {
    host: 'web.telegram.org',
    inject: {
      parent: '.messages-layout',
    },
    input: {
      selector: '#editable-message-text',
    },
  };
}
