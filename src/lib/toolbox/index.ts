import { sleep } from '$lib/utils';
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

export const getInput = (input: ToolboxWebsiteConfig['input']) => {
  const inputEl = document.querySelector(input.selector);

  if (!inputEl) return '';

  switch (input.type) {
    case 'editable':
      return (inputEl as HTMLDivElement).innerText.trim();
    case 'input':
      return (inputEl as HTMLInputElement).value.trim();
    default:
      return '';
  }
};

export const injectToInput = async (
  input: ToolboxWebsiteConfig['input'],
  text: string
) => {
  const inputEl = document.querySelector(input.selector);

  if (!inputEl) return false;

  if (input.type === 'editable') {
    const input = inputEl as HTMLDivElement;
    input.focus();
    await sleep(100);
    const sel = document.getSelection();
    sel.selectAllChildren(input);
    await sleep(100);
    document.execCommand('cut');
    await sleep(100);
    document.execCommand('inserttext', false, text.trim());
  } else if (input.type === 'input') {
    const input = inputEl as HTMLInputElement;
    input.value = text;
  }

  return true;
};
