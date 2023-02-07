import type { PromptListConfig } from './prompt-list.types';

export default {
  name: 'Awesome ChatGPT Prompts',
  url: 'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv',
  type: 'csv',
  fields: {
    title: 'act',
    prompt: 'prompt',
  },
} satisfies PromptListConfig;
