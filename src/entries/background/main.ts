import config from '$config';
import api from '$lib/api';
import { addConversation, deleteConversation } from '$lib/extension/conversations';
import { events } from '$lib/extension/events';
import { adapter } from '$lib/extension/events/adapters/amplitude';
import { OpenAppSource, UserEvent } from '$lib/extension/events/event.constants';
import { getExtensionInfo } from '$lib/extension/events/event.module';
import {
  listenConnection,
  listenMessage,
  messageError,
  sendMessageToTab,
} from '$lib/extension/messaging';
import { Connection, Message } from '$lib/extension/messaging/messaging.constants';
import browser from 'webextension-polyfill';

const CONTEXT_MENU_ID = 'UniJump.ai';
const TOGGLE_SHORTCUT_NAME =
  __MANIFEST_VERSION__ === 2 ? '_execute_browser_action' : '_execute_action';

events.init({
  adapter: adapter({
    apiKey: import.meta.env.PUBLIC_AMPLITUDE_API_KEY,
    debug: true,
  }),
});

const toggleModal = async (tabId: number, source: OpenAppSource, open?: boolean) => {
  const { response } = await sendMessageToTab(
    tabId,
    open ? Message.OPEN_MODAL : Message.TOGGLE_MODAL
  );

  if (response) {
    events.send(UserEvent.APP_OPEN, { 'opened-from': source });
  }
};

const createUninstallUrl = async () => {
  const url = new URL(config.visitUrl.uninstall);
  const { version, deviceId, userId } = await getExtensionInfo();
  url.searchParams.set('e', JSON.stringify({ version, deviceId, userId }));

  browser.runtime.setUninstallURL(url.toString());
};

if (config.visitUrl.uninstall) {
  createUninstallUrl();
}

browser.runtime.onInstalled.addListener(async (details) => {
  const installReason = details.reason;
  console.debug(`UniJump Installed: ${installReason}`);

  if (installReason === 'install') {
    if (config.visitUrl.install) {
      browser.tabs.create({ url: config.visitUrl.install });
    }

    events.send(UserEvent.EXTENSION_INSTALL);
  }

  if (installReason === 'update') {
    events.send(UserEvent.EXTENSION_UPDATE);
  }

  browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'UniJump',
    contexts: ['all'],
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  toggleModal(tab.id, OpenAppSource.CONTEXT_MENU, true);
});

// Manifest v2/v3 differences
(browser.action || browser.browserAction).onClicked.addListener(async (tab) => {
  toggleModal(tab.id, OpenAppSource.TOPBAR);
});

listenMessage(Message.CHECK_USER, async () => {
  try {
    await api.checkUser();

    return {
      response: true,
    };
  } catch (err) {
    return messageError(err);
  }
});

listenMessage(Message.SET_CONVERSATION_PROPERTY, async ({ conversationId, props }) => {
  try {
    await api.setConversationProperty(conversationId, props);
    return { response: true };
  } catch (err) {
    return messageError(err);
  }
});

listenMessage(Message.OPEN_CHATGPT_TAB, (urlString, sender) => {
  return new Promise((resolve) => {
    browser.tabs
      .create({
        url: urlString,
      })
      .then((tab) => {
        const onTabUpdated = async () => {
          try {
            await api.checkUser();
            removeListener();
            browser.tabs.update(sender.tab.id, { active: true });
            resolve({ response: true });
            browser.tabs.remove(tab.id);
          } catch (error) {}
        };

        const removeListener = () => {
          browser.tabs.onUpdated.removeListener(onTabUpdated);
        };

        browser.tabs.onUpdated.addListener(onTabUpdated);
      });
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
    response: shortcut,
  };
});

listenMessage(Message.OPEN_TAB, (url, sender) => {
  browser.tabs.create({
    url,
    index: sender.tab.index + 1,
  });
});

listenMessage(Message.OPEN_OPTIONS_PAGE, () => {
  browser.runtime.openOptionsPage();
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
