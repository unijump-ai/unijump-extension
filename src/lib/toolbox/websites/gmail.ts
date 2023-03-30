import { inlineStyle } from '$lib/utils';
import type { ToolboxWebsiteConfig, ToolboxWebsitePlugin } from '../toolbox.types';

export function createGmailConfig(): ToolboxWebsiteConfig {
  const inputSelector = '[g_editable="true"]';
  const insertBefore = '[enctype="multipart/form-data"]';

  return {
    name: 'Gmail',
    host: 'mail.google.com',
    inject: {
      insertBefore,
    },
    input: {
      selector: inputSelector,
    },
    plugins: [gmailStylePlugin()],
  };
}

function gmailStylePlugin(): ToolboxWebsitePlugin {
  return {
    afterMount(toolbox) {
      const container = toolbox.getContainer();

      if (!container) return;

      const isInDialog = !!container.closest('[role=dialog]');

      const toolboxStyles = inlineStyle({
        width: isInDialog ? 'calc(100% + 32px)' : 'calc(100% + 2px)',
        'border-radius': isInDialog ? '0 !important' : '16px 16px 0 0',
        'margin-left': isInDialog ? '-16px' : '-1px',
        'margin-top': isInDialog ? '' : '-1px',
      });
      const position = isInDialog ? 'top' : 'bottom';

      toolbox.setConfig({ toolboxStyles, position });
    },
  };
}
