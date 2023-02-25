export enum UserEvent {
  APP_OPEN = 'APP_OPEN',
  EXTENSION_INSTALL = 'EXTENSION_INSTALL',
  PROMPT_SAVE = 'PROMPT_SAVE',
  PROMPT_UNSAVE = 'PROMPT_UNSAVE',
  MESSAGE_SENT = 'MESSAGE_SENT',
}

export enum APP_OPEN_SOURCE {
  TOPBAR = 'topbar',
  CONTEXT_MENU = 'context-menu',
  FLOATING_WIDGET = 'floating-widget',
  SHORTCUT = 'shortcut',
}
