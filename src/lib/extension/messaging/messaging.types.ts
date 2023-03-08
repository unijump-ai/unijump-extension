import type {
  ApiSession,
  ConversationParams,
  ConversationProperty,
  ConversationResponse,
} from '$lib/api';
import type { Runtime } from 'webextension-polyfill';
import type { UserEventMessage } from '../events/event.types';
import type { Connection, Message } from './messaging.constants';

export interface ConnectionMessage {
  type: Connection;
  payload: Record<string, string>;
  error?: string;
}

export type MessagePayloadMap = {
  [Message.OPEN_MODAL]: void;
  [Message.TOGGLE_MODAL]: void;
  [Message.GET_SESSION]: void;
  [Message.SET_CONVERSATION_PROPERTY]: {
    conversationId: string;
    props: Partial<ConversationProperty>;
  };
  [Message.OPEN_CHATGPT_TAB]: string;
  [Message.SEND_EVENT]: UserEventMessage;
  [Message.GET_TOGGLE_SHORTCUT]: void;
  [Message.OPEN_TAB]: string;
  [Message.OPEN_OPTIONS_PAGE]: void;
};

export type MessageResponseMap = {
  [Message.OPEN_MODAL]: boolean;
  [Message.TOGGLE_MODAL]: boolean;
  [Message.GET_SESSION]: ApiSession;
  [Message.SET_CONVERSATION_PROPERTY]: boolean;
  [Message.OPEN_CHATGPT_TAB]: void;
  [Message.SEND_EVENT]: void;
  [Message.GET_TOGGLE_SHORTCUT]: string;
  [Message.OPEN_TAB]: void;
};

export type ConnectionPayloadMap = {
  [Connection.CHAT]: {
    response: ConversationResponse;
    done: boolean;
  };
};

export type ConnectionMessageMap = {
  [Connection.CHAT]: ConversationParams;
};

export interface MessageEvent<T extends keyof MessagePayloadMap> {
  type: T;
  payload: MessagePayloadMap[T];
}

export interface PortMessageEvent<T extends keyof ConnectionMessageMap> {
  type: T;
  payload: ConnectionMessageMap[T];
}

export interface PortPayloadEvent<T extends keyof ConnectionPayloadMap> {
  type: T;
  payload: ConnectionPayloadMap[T];
  error: {
    name: string;
    message: string;
  };
}

export interface MessageResponse<T extends keyof MessageResponseMap> {
  error?: Error;
  message?: MessageResponseMap[T];
}

export interface ConnectionHandler<T extends keyof ConnectionMessageMap> {
  disconnect: () => void;
  sendMessage: (message: ConnectionMessageMap[T]) => void;
}

export type MessagePayload<T extends keyof MessagePayloadMap> = MessagePayloadMap[T];
export type MessageCallback<
  T extends keyof MessagePayloadMap,
  K extends keyof MessageResponseMap
> = (
  payload: MessagePayload<T>,
  sender: Runtime.MessageSender
) => Promise<MessageResponse<K>> | void;
export type MessageUnsubsriber = () => void;
