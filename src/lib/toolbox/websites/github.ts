import type { ToolboxWebsiteConfig } from '../toolbox.types';

export function createGithubConfig(): ToolboxWebsiteConfig {
  const inputSelector = '.js-comment-field';
  return {
    host: 'github.com',
    inject: {
      insertAfter: inputSelector,
    },
    input: {
      selector: inputSelector,
    },
  };
}
