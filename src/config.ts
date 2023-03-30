export default {
  landingPage: {
    host: 'https://unijump.ai',
  },
  visitUrl: {
    install: 'https://unijump.ai/welcome/index.html',
    uninstall: 'https://uninstall.unijump.ai/',
    browserAction: 'https://unijump.ai/web/',
  },
  chatGPT: {
    baseUrl: 'https://chat.openai.com',
    chatUrl: 'https://chat.openai.com/chat',
    authUrl: 'https://auth0.openai.com',
  },
  defaultShortcut: {
    mac: 'Command+J',
    default: 'Alt+J',
  },
} as const;
