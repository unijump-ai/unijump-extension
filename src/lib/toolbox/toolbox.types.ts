import type { ToolboxActionType } from './toolbox.constants';

export interface ToolboxWebsiteConfig {
  name: string;
  host: string;
  inject: {
    parent?: string;
    insertBefore?: string;
    insertAfter?: string;
  };
  input: {
    selector: string;
  };
  position?: 'top' | 'bottom';
  plugins?: ToolboxWebsitePlugin[];
  style?: 'flat' | 'rounded';
  disabled?: boolean;
  toolboxStyles?: string;
  actionMenuHeight?: string;
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

export interface ToolboxWebsitePlugin {
  beforeMount?: (toolbox: ToolboxApi) => void;
  afterMount?: (toolbox: ToolboxApi) => void;
}

export type AssignToolboxWebsiteConfig = Partial<Omit<ToolboxWebsiteConfig, 'plugins'>>;

export interface ToolboxApi {
  getContainer: () => HTMLElement;
  setContainer: (container: HTMLElement) => void;
  getConfig: () => ToolboxWebsiteConfig;
  setConfig: (config: AssignToolboxWebsiteConfig) => void;
}
