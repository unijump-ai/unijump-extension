export enum UserEvent {
  APP_OPEN = 'APP_OPEN',
  EXTENSION_INSTALL = 'EXTENSION_INSTALL',
  EXTENSION_UPDATE = 'EXTENSION_UPDATE',
  PROMPT_SAVE = 'PROMPT_SAVE',
  PROMPT_UNSAVE = 'PROMPT_UNSAVE',
  MESSAGE_SENT = 'MESSAGE_SENT',
}

export enum OpenAppSource {
  TOPBAR = 'topbar',
  CONTEXT_MENU = 'context-menu',
  FLOATING_WIDGET = 'floating-widget',
  SHORTCUT = 'shortcut',
}
