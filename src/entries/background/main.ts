import browser from 'webextension-polyfill';
import api from '$lib/api';
import {
  listenConnection,
  listenMessage,
  messageError,
  sendMessageToTab,
} from '$lib/extension/messaging';
import { Connection, Message } from '$lib/extension/messaging/messaging.constants';
import { events } from '$lib/extension/events';
import { adapter } from '$lib/extension/events/adapters/amplitude';
import { OpenAppSource, UserEvent } from '$lib/extension/events/event.constants';
import { addConversation, deleteConversation } from '$lib/extension/conversations';

const CONTEXT_MENU_ID = 'UniJump.ai';
const TOGGLE_SHORTCUT_NAME =
  __MANIFEST_VERSION__ === 2 ? '_execute_browser_action' : '_execute_action';

events.init({
  adapter: adapter({
    apiKey: import.meta.env.CLIENT_AMPLITUDE_API_KEY,
    debug: true,
  }),
});

const toggleModal = async (tabId: number, source: OpenAppSource, open?: boolean) => {
  const { message } = await sendMessageToTab(
    tabId,
    open ? Message.OPEN_MODAL : Message.TOGGLE_MODAL
  );

  if (message) {
    events.send(UserEvent.APP_OPEN, { 'opened-from': source });
  }
};

browser.runtime.setUninstallURL('https://bit.ly/unijump-uninstall');

browser.runtime.onInstalled.addListener(async () => {
  console.debug('UniJump Installed installed');

  browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'UniJump',
    contexts: ['all'],
  });

  events.send(UserEvent.EXTENSION_INSTALL);
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  toggleModal(tab.id, OpenAppSource.CONTEXT_MENU, true);
});

// Manifest v2/v3 differences
(browser.action || browser.browserAction).onClicked.addListener(async (tab) => {
  toggleModal(tab.id, OpenAppSource.TOPBAR);
});

listenMessage(Message.GET_SESSION, async () => {
  try {
    const session = await api.getSession();

    return {
      message: session,
    };
  } catch (err) {
    return messageError(err);
  }
});

listenMessage(Message.SET_CONVERSATION_PROPERTY, async ({ conversationId, props }) => {
  try {
    await api.setConversationProperty(conversationId, props);
    return { message: true };
  } catch (err) {
    return messageError(err);
  }
});

listenMessage(Message.OPEN_CHATGPT_TAB, (urlString, sender) => {
  const url = new URL(urlString);
  url.searchParams.set('uj', '1');
  browser.tabs
    .create({
      url: url.toString(),
    })
    .then((tab) => {
      let updatedUrl: string;
      let title: string;

      const onTabUpdated = (
        _: number,
        changeInfo: browser.Tabs.OnUpdatedChangeInfoType
      ) => {
        if (changeInfo.url) {
          updatedUrl = changeInfo.url;
        }
        if (changeInfo.title) {
          title = changeInfo.title;
        }

        if (updatedUrl === url.toString() && title === 'New chat') {
          removeListener();
          browser.tabs.update(sender.tab.id, { active: true });
          browser.tabs.remove(tab.id);
        }
      };

      const removeListener = () => {
        browser.tabs.onUpdated.removeListener(onTabUpdated);
      };

      browser.tabs.onUpdated.addListener(onTabUpdated);
    });
});

listenMessage(Message.SEND_EVENT, ({ type, props }) => {
  events.send(type, props);
});

listenMessage(Message.GET_TOGGLE_SHORTCUT, async () => {
  const commands = await browser.commands.getAll();
  const toggleAppCommand = commands.find(
    (command) => command.name === TOGGLE_SHORTCUT_NAME
  );

  const shortcut =
    toggleAppCommand?.shortcut && toggleAppCommand.shortcut !== ''
      ? toggleAppCommand.shortcut
      : null;

  return {
    message: shortcut,
  };
});

listenMessage(Message.OPEN_TAB, (url, sender) => {
  browser.tabs.create({
    url,
    index: sender.tab.index + 1,
  });
});

browser.runtime.onConnect.addListener((port) => {
  browser.tabs.onRemoved.addListener((tabId) => {
    deleteConversation(tabId);
  });

  listenConnection(port, Connection.CHAT, async (message, respond, error) => {
    try {
      await api.conversation(message, (response, done) => {
        if (response?.conversationId) {
          addConversation(port.sender.tab.id, response.conversationId);
        }

        respond({ response, done });
      });
    } catch (err) {
      error(err);
    }
  });
});
