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

const CONTEXT_MENU_ID = 'UniJump.ai';

const openModal = async (tabId: number, source: OpenAppSource) => {
  const { message } = await sendMessageToTab(tabId, Message.OPEN_MODAL);

  if (message) {
    events.send(UserEvent.APP_OPEN, { 'opened-from': source });
  }
};

browser.runtime.onInstalled.addListener(async () => {
  console.debug('UniJump Installed installed');

  browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'UniJump',
    contexts: ['all'],
  });

  events.init({
    adapter: adapter({
      apiKey: import.meta.env.CLIENT_AMPLITUDE_API_KEY,
      debug: true,
    }),
  });

  events.send(UserEvent.EXTENSION_INSTALL);
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  openModal(tab.id, OpenAppSource.CONTEXT_MENU);
});

// Manifest v2/v3 differences
(browser.action || browser.browserAction).onClicked.addListener(async (tab) => {
  openModal(tab.id, OpenAppSource.TOPBAR);
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

browser.runtime.onConnect.addListener((port) => {
  listenConnection(port, Connection.CHAT, async (message, respond, error) => {
    try {
      await api.conversation(message, (response, done) => {
        respond({ response, done });
      });
    } catch (err) {
      error(err);
    }
  });
});
