// TODO: Change this file behaviour and name to keep shortcuts only on extension
import type { ShortcutName } from './shortcut.constants';
import { matchKeyToEvent, type KeyOptions } from './events';

interface ShortcutOptions {
  display: string;
  listen: boolean;
  keyOptions?: KeyOptions;
}

const registeredShortcuts = new Map<ShortcutName, ShortcutOptions>();

export const registerShortcut = (name: ShortcutName, options: ShortcutOptions) => {
  registeredShortcuts.set(name, options);
};

const onKeydown = (event: KeyboardEvent) => {
  const shortcuts = [...registeredShortcuts.values()].filter(
    (shortcut) => shortcut.listen
  );

  shortcuts.forEach((shortcut) => {
    const triggered = matchKeyToEvent(shortcut.keyOptions, event);

    if (!triggered) return;

    event.preventDefault();
    shortcut.keyOptions.onEvent(event);
  });
};

document.addEventListener('keydown', onKeydown);
