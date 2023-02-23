import hotkeys from 'hotkeys-js';
import { isMac } from './utils';
hotkeys.filter = () => true; // Work anywhere including input, textarea...

interface PlatformShortcuts {
  mac: string;
  default: string;
}

const shortcuts = {
  app: {
    mac: '⌘+j',
    default: 'ctrl+j',
  },
} satisfies Record<string, PlatformShortcuts>;

export const getShortcut = <T extends keyof typeof shortcuts>(key: T) => {
  const shortcut = shortcuts[key];

  return isMac() ? shortcut.mac : shortcut.default;
};

export const registerShortcut = hotkeys;
