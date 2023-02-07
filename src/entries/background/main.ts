import browser from 'webextension-polyfill';
import api from '$lib/api';
import { SHORTCUT_COMMAND_ID } from '$lib/constants';
import {
  listenConnection,
  listenMessage,
  sendMessageToTab,
} from '$lib/extension/messaging';
import { Connection, Message } from '$lib/extension/messaging/messaging.constants';

const MENU_ITEM_ID = 'unitext.ai';

browser.runtime.onInstalled.addListener(() => {
  console.debug('Extension installed');
});

browser.contextMenus.create({
  id: MENU_ITEM_ID,
  title: 'UniText',
  contexts: ['all'],
});

// Manifest v2/v3 differences
(browser.action || browser.browserAction).onClicked.addListener(async (tab) => {
  sendMessageToTab(tab.id, Message.TOGGLE_MODAL);
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  const { menuItemId } = info;

  if (menuItemId !== MENU_ITEM_ID) return;

  sendMessageToTab(tab.id, Message.OPEN_MODAL);
});

listenMessage(Message.GET_SESSION, async () => {
  try {
    const session = await api.getSession();

    return {
      message: session,
    };
  } catch (err) {
    return {
      error: err,
    };
  }
});

listenMessage(Message.SET_CONVERSATION_PROPERTY, async ({ conversationId, props }) => {
  try {
    await api.setConversationProperty(conversationId, props);
    return { message: true };
  } catch (err) {
    return { error: err.message || err };
  }
});

browser.runtime.onConnect.addListener((port) => {
  // TODO: This prevents sending remove request after close
  // port.onDisconnect.addListener(() => {
  //   api.abortRequests();
  // });

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

browser.commands.onCommand.addListener(async (command, tab) => {
  if (command === SHORTCUT_COMMAND_ID) {
    sendMessageToTab(tab.id, Message.TOGGLE_MODAL);
  }
});
