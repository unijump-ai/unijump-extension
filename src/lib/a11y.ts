export const bindKeyEvent = (keys: string[], cb: (event: KeyboardEvent) => void) => {
  return function onKeyEvent(evt: KeyboardEvent) {
    if (keys.includes(evt.key)) {
      cb(evt);
    }
  };
};
