import type { ToolboxActionType } from './toolbox.constants';

export interface ToolboxWebsiteConfig {
  style: 'flat' | 'rounded';
  host: string;
  waitFor: string;
  inject: {
    parent: string;
    insertBefore?: string;
  };
  createRootElement?: () => HTMLElement;
  getValue: () => string;
  disabled?: boolean;
}

export interface ToolboxActionMenuItem {
  label: string;
  value: any;
}

export interface ToolboxActionEvent {
  input: string;
  selected?: ToolboxActionMenuItem;
}

export interface ToolboxActionConfig {
  type: ToolboxActionType;
  label: string;
  items?: ToolboxActionMenuItem[];
  callback: (event: ToolboxActionEvent) => void;
}
