import type { ToolboxWebsiteConfig } from './toolbox.types';
import { toolboxWebsites } from './toolbox.websites';

const toolboxEnabledWebsites = new Map<string, ToolboxWebsiteConfig>(
  toolboxWebsites.map((toolboxWebsiteConfig) => [
    toolboxWebsiteConfig.host,
    toolboxWebsiteConfig,
  ])
);

export const getToolboxConfigForHost = (host: string) => {
  return toolboxEnabledWebsites.get(host);
};

export const disableToolboxForHost = (host: string) => {
  const toolboxConfig = getToolboxConfigForHost(host);

  toolboxConfig.disabled = true;
  toolboxEnabledWebsites.set(host, toolboxConfig);
};
