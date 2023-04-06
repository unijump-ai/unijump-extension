import { MAX_Z_INDEX } from '$lib/style';
import type { ToolboxWebsiteConfig } from '../toolbox.types';

export function createTwitterConfig(): ToolboxWebsiteConfig {
  return {
    name: 'Twitter',
    host: 'twitter.com',
    position: 'top',
    style: 'rounded',
    inject: {
      insertAfter: '[data-testid="toolBar"]',
    },
    input: {
      selector: '.public-DraftEditor-content',
    },
    plugins: [
      {
        beforeMount(toolbox) {
          const container = document.createElement('div');
          container.style.marginTop = '12px';

          toolbox.setContainer(container);
        },
        afterMount(toolbox) {
          const container = toolbox.getContainer();
          const parent = container.parentNode as HTMLElement;
          parent.style.zIndex = MAX_Z_INDEX;
        },
      },
    ],
  };
}
