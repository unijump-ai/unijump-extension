import type { ShortcutName } from './shortcut.constants';
import { matchKeyToEvent, type KeyOptions } from './events';

interface ShortcutOptions {
  display: string;
  keyOptions: KeyOptions;
}

const registeredShortcuts = new Map<ShortcutName, ShortcutOptions>();

export const registerShortcut = (name: ShortcutName, options: ShortcutOptions) => {
  registeredShortcuts.set(name, options);
};

export const getShortcut = (name: ShortcutName) => {
  return registeredShortcuts.get(name);
};

const onKeydown = (event: KeyboardEvent) => {
  const shortcuts = [...registeredShortcuts.values()];

  shortcuts.forEach((shortcut) => {
    const triggered = matchKeyToEvent(shortcut.keyOptions, event);

    if (!triggered) return;

    event.preventDefault();
    shortcut.keyOptions.onEvent(event);
  });
};

document.addEventListener('keydown', onKeydown);
