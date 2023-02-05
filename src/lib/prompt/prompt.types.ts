export enum PromptArgType {
  MULTI_SELECT = 'multi-select',
  SELECT = 'select',
}

export interface PromptArgItem {
  title: string;
  value: string;
}

export interface PromptArg {
  key: string;
  title: string;
  type: PromptArgType;
  list: PromptArgItem[];
}

export interface PromptUserArg {
  user: string[];
}

export type SelectedPromptArgs<T extends string = any> = Record<T, string[]>;
export type AllPromptArgs<T extends string = any> = SelectedPromptArgs<T> & PromptUserArg;

export interface PromptConfig<T extends string = any> {
  name: string;
  initialPrompt: (input: string) => string;
  input: (args: SelectedPromptArgs<T> & PromptUserArg, userInput: string) => string;
  args: PromptArg[];
}

export interface PromptEventPayload {
  input: string;
  initial: string;
}
