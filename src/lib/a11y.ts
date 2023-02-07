export const bindKeyPress = (keys: string[], cb: (event: KeyboardEvent) => void) => {
  return function onButtonKeypress(evt: KeyboardEvent) {
    if (keys.includes(evt.key)) {
      cb(evt);
    }
  };
};
