import config from '$config';
import { UserEvent } from '$lib/extension/events/event.constants';
import { sendMessage } from '$lib/extension/messaging';
import { Message } from '$lib/extension/messaging/messaging.constants';
import { ExtensionStorage } from '$lib/extension/storage';
import { StorageKey } from '$lib/extension/storage/storage.constants';
import { toggleInArray } from '$lib/utils';
import { get, writable } from 'svelte/store';

interface OptionsState {
  widgetDisabled: boolean;
  disabledWidgetHosts: string[];
  disabledToolboxHosts: string[];
}

const defaultOptions = {
  widgetDisabled: false,
  disabledWidgetHosts: [config.chatGPT.authUrl, config.chatGPT.baseUrl].map(
    (url) => new URL(url).hostname
  ),
  disabledToolboxHosts: [],
};

export const optionsStorage = new ExtensionStorage<OptionsState>(StorageKey.OPTIONS);

export const createOptionsStore = () => {
  const optionsStore = writable<OptionsState>(null);

  optionsStorage.get().then((options) => {
    const optionsState = {
      ...defaultOptions,
      ...(options || {}),
    };
    optionsStore.set(optionsState);
  });

  optionsStore.subscribe((optionsState) => {
    optionsStorage.set(optionsState);
  });

  const updateWidgetDisabled = (disabled: boolean) => {
    optionsStore.update((optionsState) => ({
      ...optionsState,
      widgetDisabled: disabled,
    }));
  };

  const toggleWidgetHost = (host: string) => {
    optionsStore.update((optionsState) => ({
      ...optionsState,
      disabledWidgetHosts: toggleInArray(optionsState.disabledWidgetHosts, host),
    }));
  };

  const toggleToolboxHost = (host: string) => {
    const state = get(optionsStore);
    const disabledToolboxHosts = toggleInArray(state.disabledToolboxHosts, host);
    const action = disabledToolboxHosts.includes(host) ? 'disable' : 'enable';

    sendMessage(Message.SEND_EVENT, {
      type: UserEvent.TOOLBOX_WEBSITE_TOGGLE,
      props: {
        host,
        action,
      },
    });

    optionsStore.update((optionsState) => ({
      ...optionsState,
      disabledToolboxHosts,
    }));
  };

  return {
    subscribe: optionsStore.subscribe,
    updateWidgetDisabled,
    toggleWidgetHost,
    toggleToolboxHost,
  };
};
