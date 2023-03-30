import { getExceptionByName } from '$lib/exceptions';
import browser, { type Runtime } from 'webextension-polyfill';
import { Message } from './messaging.constants';
import type {
  ConnectionHandler,
  ConnectionMessageMap,
  ConnectionPayloadMap,
  MessageCallback,
  MessageEvent,
  MessagePayload,
  MessagePayloadMap,
  MessageResponse,
  MessageResponseMap,
  MessageUnsubsriber,
  PortMessageEvent,
  PortPayloadEvent,
} from './messaging.types';

export const messageError = (
  err: Error
): { error: { name: string; message: string } } => {
  return {
    error: {
      name: err.name || 'Error',
      message: err.message || '',
    },
  };
};

export const listenMessage = <
  T extends keyof MessagePayloadMap,
  K extends keyof MessageResponseMap
>(
  message: T,
  callback: MessageCallback<T, K>
): MessageUnsubsriber => {
  const onMessage = (
    messageEvent: MessageEvent<T>,
    sender: browser.Runtime.MessageSender
  ): ReturnType<MessageCallback<T, K>> => {
    if (!Object.values(Message).includes(message) || messageEvent.type !== message)
      return;

    return callback(messageEvent.payload, sender);
  };

  browser.runtime.onMessage.addListener(onMessage);

  return () => {
    browser.runtime.onMessage.removeListener(onMessage);
  };
};

export const sendMessage = async <T extends keyof MessagePayloadMap>(
  message: T,
  payload: MessagePayload<T>
): Promise<MessageResponse<T>> => {
  const response = await browser.runtime.sendMessage({ type: message, payload });

  if (response?.error) {
    const internalException = getExceptionByName(response.error.name);
    const exception = new (internalException || Error)(response.error.message);
    return { error: exception };
  }

  return response;
};

export const sendMessageToTab = async <T extends keyof MessagePayloadMap>(
  tabId: number,
  message: T,
  payload?: MessagePayload<T>
): Promise<MessageResponse<T>> => {
  try {
    const response = await browser.tabs.sendMessage(tabId, { type: message, payload });

    return {
      response,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const listenConnection = <T extends keyof ConnectionMessageMap>(
  port: browser.Runtime.Port,
  type: T,
  callback: (
    payload: ConnectionMessageMap[T],
    respond: (payload: ConnectionPayloadMap[T]) => void,
    error: (err: Error) => void
  ) => void
) => {
  port.onMessage.addListener((portPayloadEvent: PortMessageEvent<T>) => {
    if (portPayloadEvent.type !== type) return;

    const respond = (payload: ConnectionPayloadMap[T]) =>
      port.postMessage({ type, payload });

    const error = (err: Error) => {
      port.postMessage({ error: { name: err.name, message: err.message }, type });
    };

    callback(portPayloadEvent.payload, respond, error);
  });
};

export const openConnection = <T extends keyof ConnectionPayloadMap>(
  type: T,
  message: ConnectionMessageMap[T],
  callback: (payload: ConnectionPayloadMap[T], error?: Error) => void
): ConnectionHandler<T> => {
  let disconnected = false;
  let port: Runtime.Port;

  const setupPort = () => {
    port = browser.runtime.connect();

    port.onDisconnect.addListener(() => {
      disconnected = true;
    });

    port.onMessage.addListener((portMessageEvent: PortPayloadEvent<T>) => {
      if (portMessageEvent.type !== type) return;

      const error = portMessageEvent.error
        ? new (getExceptionByName(portMessageEvent.error.name) || Error)(
            portMessageEvent.error.message
          )
        : undefined;

      callback(portMessageEvent.payload, error);
    });
  };

  setupPort();
  port.postMessage({ type, payload: message });

  return {
    disconnect: () => {
      port.disconnect();
    },
    sendMessage: (message) => {
      if (disconnected) {
        setupPort();
      }
      port.postMessage({ type, payload: message });
    },
  };
};
