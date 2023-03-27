import config from '$config';
import { UserEvent, type OpenAppSource } from '$lib/extension/events/event.constants';
import { sendMessage } from '$lib/extension/messaging';
import { Message } from '$lib/extension/messaging/messaging.constants';
import { PageName } from '$lib/navigation';
import { activePage, appModalVisible, errorStore, selectedText } from '$lib/store';
import { get } from 'svelte/store';

class AppManager {
  private $el: HTMLElement;

  constructor() {}

  set wrapperEl(el: HTMLElement) {
    this.$el = el;
  }

  focus() {
    this.$el?.focus();
  }

  openModal(source?: OpenAppSource) {
    const selection = window.getSelection().toString();

    if (selection) {
      selectedText.set(selection || '');
      activePage.set(PageName.Paraphraser);
    }

    appModalVisible.set(true);
    this.focus();

    if (source) {
      sendMessage(Message.SEND_EVENT, {
        type: UserEvent.APP_OPEN,
        props: { 'opened-from': source },
      });
    }
    this.checkSession();
  }

  closeModal() {
    appModalVisible.set(false);
    errorStore.set(null);
  }

  toggleModal() {
    const isModalVisible = get(appModalVisible);

    if (isModalVisible) {
      this.closeModal();
    } else {
      this.openModal();
    }
  }

  async checkSession() {
    const { error } = await sendMessage(Message.CHECK_USER, undefined);

    if (error) {
      errorStore.set(error);
      return;
    }
  }

  isInWebView() {
    return window.location.href.startsWith(config.visitUrl.browserAction);
  }
}

export const appManager = new AppManager();
