import config from '$config';
import type { ChatGPTModel } from '$lib/api';
import { UserEvent, type OpenAppSource } from '$lib/extension/events/event.constants';
import { sendMessage } from '$lib/extension/messaging';
import { Message } from '$lib/extension/messaging/messaging.constants';
import { ExtensionStorage } from '$lib/extension/storage';
import { PageName } from '$lib/navigation';
import { StoreService } from '$lib/services/store';
import {
  activePage,
  appModalVisible,
  errorStore,
  pageAction,
  selectedText,
} from '$lib/store';
import { get } from 'svelte/store';

const selectedModelStorage = new ExtensionStorage<ChatGPTModel>('selected-model');

interface AppStore {
  models: ChatGPTModel[];
  selectedModel: ChatGPTModel;
}

class AppManager extends StoreService<AppStore> {
  private $el: HTMLElement;

  constructor() {
    super({ models: [], selectedModel: null });
    this.checkSession();
  }

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
    pageAction.clear();
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

    this.fetchModels();
  }

  async fetchModels() {
    const { models } = this.getState();

    if (models.length) return;

    try {
      const { response } = await sendMessage(Message.FETCH_MODELS, undefined);
      const selectedModel = await selectedModelStorage.get();
      this.setState({ models: response, selectedModel: selectedModel || response[0] });
    } catch (error) {}
  }

  selectModel(model: ChatGPTModel) {
    selectedModelStorage.set(model);
    this.updateState({ selectedModel: model });
  }

  isInWebView() {
    return window.location.href.startsWith(config.visitUrl.browserAction);
  }
}

export const appManager = new AppManager();
