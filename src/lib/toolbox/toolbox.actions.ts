import { appManager } from '$lib/app';
import { OpenAppSource } from '$lib/extension/events/event.constants';
import { PageName } from '$lib/navigation';
import { PromptManager } from '$lib/prompt';
import { pageAction, selectedText } from '$lib/store';
import paraphraserConfig from '$prompts/paraphraser';
import { ToolboxActionType } from './toolbox.constants';
import type { ToolboxActionConfig, ToolboxWebsiteConfig } from './toolbox.types';

type ToolboxActionCreate = (
  toolboxInput: HTMLElement,
  toolboxConfig?: ToolboxWebsiteConfig
) => ToolboxActionConfig;

export const toolboxActions: ToolboxActionCreate[] = [
  createParaphraseAction,
  createToneAction,
  createGrammarAction,
];

function createParaphraseAction(
  toolboxInput: HTMLElement,
  toolboxConfig: ToolboxWebsiteConfig
): ToolboxActionConfig {
  return {
    type: ToolboxActionType.Button,
    label: 'Improve Writing',
    callback(event) {
      selectedText.set(event.input || '');
      const promptManager = new PromptManager(paraphraserConfig);
      const input = { element: toolboxInput, name: toolboxConfig.name };

      appManager.openModal(OpenAppSource.TOOLBAR);
      pageAction.run(PageName.Paraphraser, promptManager.args, input, !!event.input);
    },
  };
}

function createToneAction(
  toolboxInput: HTMLElement,
  toolboxConfig: ToolboxWebsiteConfig
): ToolboxActionConfig {
  const promptManager = new PromptManager(paraphraserConfig);
  const tonesKey = 'tones';
  const toneList = promptManager.getArgConfig(tonesKey).list;

  return {
    type: ToolboxActionType.Menu,
    label: 'Change Tone',
    items: toneList,
    callback(event) {
      selectedText.set(event.input || '');
      promptManager.clearArgs();
      promptManager.addArg(tonesKey, event.selected);
      appManager.openModal(OpenAppSource.TOOLBAR);

      const input = { element: toolboxInput, name: toolboxConfig.name };
      pageAction.run(PageName.Paraphraser, promptManager.args, input, !!event.input);
    },
  };
}

function createGrammarAction(
  toolboxInput: HTMLElement,
  toolboxConfig: ToolboxWebsiteConfig
): ToolboxActionConfig {
  return {
    type: ToolboxActionType.Button,
    label: 'Check Grammar',
    callback(event) {
      appManager.openModal(OpenAppSource.TOOLBAR);
      const prompt = `Check grammar for:\n${event.input}`;
      const args = { chat: [{ value: prompt, label: '' }] };
      const input = { element: toolboxInput, name: toolboxConfig.name };

      pageAction.run(PageName.Chat, args, input, !!event.input);
    },
  };
}
