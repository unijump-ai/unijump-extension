import type {
  ApiSession,
  ConversationParams,
  ConversationProperty,
  ConversationResponse,
} from '$lib/api';
import type { Runtime } from 'webextension-polyfill';
import type { Connection, Message } from './messaging.constants';

export interface ConnectionMessage {
  type: Connection;
  payload: Record<string, string>;
  error?: string;
}

export type MessagePayloadMap = {
  [Message.OPEN_MODAL]: {
    selectionText?: string;
  };
  [Message.TOGGLE_MODAL]: {
    selectionText?: string;
  };
  [Message.GET_SESSION]: void;
  [Message.SET_CONVERSATION_PROPERTY]: {
    conversationId: string;
    props: Partial<ConversationProperty>;
  };
  [Message.OPEN_CHATGPT_TAB]: string;
};

export type MessageResponseMap = {
  [Message.OPEN_MODAL]: void;
  [Message.TOGGLE_MODAL]: void;
  [Message.GET_SESSION]: ApiSession;
  [Message.SET_CONVERSATION_PROPERTY]: boolean;
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

// export type MessageResponse<T extends keyof MessageResponseMap> = MessageResponseMap[T];
export type MessagePayload<T extends keyof MessagePayloadMap> = MessagePayloadMap[T];
export type MessageCallback<
  T extends keyof MessagePayloadMap,
  K extends keyof MessageResponseMap
> = (
  payload: MessagePayload<T>,
  sender: Runtime.MessageSender
) => Promise<MessageResponse<K>> | void;
export type MessageUnsubsriber = () => void;
