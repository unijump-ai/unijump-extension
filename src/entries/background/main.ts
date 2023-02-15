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
