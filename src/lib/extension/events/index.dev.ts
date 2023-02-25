const errorText =
  'Events module should be used only in background page! Please use sendMessage(Message.SEND_EVENT, ...)';

export const events = {
  init() {
    console.error(errorText);
  },
  send() {
    console.error(errorText);
  },
};
