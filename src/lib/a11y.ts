import omit from 'lodash.omit';

export enum ModifierKey {
  Alt = 'altKey',
  Ctrl = 'ctrlKey',
  Meta = 'metaKey',
  Shift = 'shiftKey',
}

type ModifierKeyOptions = Record<ModifierKey, boolean>;
type KeysMatch = Partial<ModifierKeyOptions> & { key: string };
type KeyOptions = KeysMatch & { onEvent: (event: KeyboardEvent) => void };

export const bindKeyEvent = (...keyOptionInits: KeyOptions[]) => {
  return function onKeyEvent(event: KeyboardEvent) {
    keyOptionInits.forEach((keyOptions) => {
      const triggered = matchKeyToEvent(keyOptions, event);

      if (triggered) {
        keyOptions.onEvent?.(event);
      }
    });
  };
};

function matchKeyToEvent(keyOptions: KeyOptions, event: KeyboardEvent): boolean {
  if (typeof keyOptions !== 'object') {
    return false;
  }

  const keysMatch = omit(keyOptions, 'onEvent') as KeysMatch;

  return Object.keys(keysMatch).every((eventField) => {
    const field = eventField as keyof KeysMatch;

    return keyOptions[field] === event[field];
  });
}
