import { sleep } from '$lib/utils';
import omit from 'lodash.omit';
import type {
  AssignToolboxWebsiteConfig,
  ToolboxApi,
  ToolboxWebsiteConfig,
} from './toolbox.types';
import { toolboxWebsites } from './toolbox.websites';

const defaultConfig: Partial<ToolboxWebsiteConfig> = {
  position: 'bottom',
  style: 'flat',
};

const toolboxEnabledWebsites = new Map<string, ToolboxWebsiteConfig>(
  toolboxWebsites.map((toolboxWebsiteConfig) => [
    toolboxWebsiteConfig.host,
    toolboxWebsiteConfig,
  ])
);

export const getToolboxConfigForHost = (host: string) => {
  const toolboxConfig = toolboxEnabledWebsites.get(host);

  return {
    ...toolboxConfig,
    ...defaultConfig,
  };
};

export const getInputValue = (inputEl: HTMLElement) => {
  if (!inputEl) return '';

  if (inputEl.isContentEditable) {
    return (inputEl as HTMLDivElement).innerText.trim();
  }

  return (inputEl as HTMLInputElement).value.trim();
};

export const injectToInput = async (inputEl: HTMLElement, text: string) => {
  if (!inputEl) return false;

  if (inputEl.isContentEditable) {
    const input = inputEl as HTMLDivElement;
    input.focus();
    await sleep(100);
    const sel = document.getSelection();
    sel.selectAllChildren(input);
    await sleep(100);
    document.execCommand('cut');
    await sleep(100);
    document.execCommand('inserttext', false, text.trim());
  } else {
    const input = inputEl as HTMLInputElement;
    input.value = text;
  }

  return true;
};

export const createApi = (defaultConfig: ToolboxWebsiteConfig): ToolboxApi => {
  let toolboxContainer: HTMLElement;
  let toolboxConfig = defaultConfig;

  const getContainer = () => toolboxContainer;
  const setContainer = (container: HTMLElement) => {
    toolboxContainer = container;
  };
  const getConfig = () => toolboxConfig;
  const setConfig = (config: AssignToolboxWebsiteConfig) => {
    toolboxConfig = { ...toolboxConfig, ...omit(config, ['plugins']) };
  };

  return {
    setContainer,
    getContainer,
    setConfig,
    getConfig,
  };
};
