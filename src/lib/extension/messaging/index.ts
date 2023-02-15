import type {
  MessagePayloadMap,
  MessageCallback,
  MessageUnsubsriber,
  MessagePayload,
  MessageEvent,
  ConnectionMessageMap,
  ConnectionPayloadMap,
  PortMessageEvent,
  ConnectionHandler,
  PortPayloadEvent,
  MessageResponse,
  MessageResponseMap,
} from './messaging.types';
import { getExceptionByName } from '$lib/exceptions';
import { runtime, tabs, type Runtime } from 'webextension-polyfill';
import { Message } from './messaging.constants';

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
    messageEvent: MessageEvent<T>
  ): ReturnType<MessageCallback<T, K>> => {
    if (!Object.values(Message).includes(message) || messageEvent.type !== message)
      return;

    return callback(messageEvent.payload);
  };

  runtime.onMessage.addListener(onMessage);

  return () => {
    runtime.onMessage.removeListener(onMessage);
  };
};

export const sendMessage = async <
  T extends keyof MessagePayloadMap,
  K extends keyof MessageResponseMap
>(
  message: T,
  payload: MessagePayload<T>
): Promise<MessageResponse<K>> => {
  const response = await runtime.sendMessage({ type: message, payload });

  if (response.error) {
    console.log('reserr', response.error.name);
    const internalException = getExceptionByName(response.error.name);
    const exception = new (internalException || Error)(response.error.message);
    return { error: exception };
  }

  return response;
};

export const sendMessageToTab = <T extends keyof MessagePayloadMap>(
  tabId: number,
  message: T,
  payload?: MessagePayload<T>
) => {
  return tabs.sendMessage(tabId, { type: message, payload });
};

export const listenConnection = <T extends keyof ConnectionMessageMap>(
  port: Runtime.Port,
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
  const port = runtime.connect();

  port.onMessage.addListener((portMessageEvent: PortPayloadEvent<T>) => {
    if (portMessageEvent.type !== type) return;

    const error = portMessageEvent.error
      ? new (getExceptionByName(portMessageEvent.error.name) || Error)(
          portMessageEvent.error.message
        )
      : undefined;

    callback(portMessageEvent.payload, error);
  });

  port.postMessage({ type, payload: message });

  return {
    disconnect: () => port.disconnect(),
    sendMessage: (message) => {
      port.postMessage({ type, payload: message });
    },
  };
};
