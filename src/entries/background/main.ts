import browser from 'webextension-polyfill';
import api from '$lib/api';
import {
  listenConnection,
  listenMessage,
  messageError,
  sendMessageToTab,
} from '$lib/extension/messaging';
import { Connection, Message } from '$lib/extension/messaging/messaging.constants';

browser.runtime.onInstalled.addListener(() => {
  console.debug('Extension installed');

  browser.contextMenus.create({
    id: 'Unitext.ai',
    title: 'UniText',
    contexts: ['all'],
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'Unitext.ai') return;

  sendMessageToTab(tab.id, Message.OPEN_MODAL);
});

// Manifest v2/v3 differences
(browser.action || browser.browserAction).onClicked.addListener(async (tab) => {
  sendMessageToTab(tab.id, Message.TOGGLE_MODAL);
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
  url.searchParams.set('ut', '1');
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
