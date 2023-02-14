export enum PromptArgType {
  MULTI_SELECT = 'multi-select',
  SELECT = 'select',
}

export interface PromptArgItem {
  label: string;
  value: string;
}

export interface PromptArg {
  key: string;
  title: string;
  type: PromptArgType;
  list: PromptArgItem[];
}

export interface PromptUserArg {
  user: PromptArgItem[];
}

export type SelectedPromptArgs<T extends string = any> = Record<T, PromptArgItem[]>;
export type AllPromptArgs<T extends string = any> = SelectedPromptArgs<T> & PromptUserArg;

export interface PromptConfig<T extends string = any> {
  name: string;
  initialPrompt: (input: string) => string;
  input: (args: AllPromptArgs<T>, userInput: string) => string;
  args: PromptArg[];
}

export interface PromptEventPayload {
  input: string;
  initial: string;
}
