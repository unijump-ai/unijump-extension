import type { ApiSession, ConversationParams, ConversationProperty } from '$lib/api';
import type { Answer } from '$lib/types';
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
};

export type MessageResponseMap = {
  [Message.OPEN_MODAL]: void;
  [Message.TOGGLE_MODAL]: void;
  [Message.GET_SESSION]: ApiSession;
  [Message.SET_CONVERSATION_PROPERTY]: boolean;
};

export type ConnectionPayloadMap = {
  [Connection.CHAT]: {
    answer: Answer;
    done: boolean;
  };
  [Connection.ANOTHER]: void;
};

export type ConnectionMessageMap = {
  [Connection.CHAT]: ConversationParams;
  [Connection.ANOTHER]: void;
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
  error: any;
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
> = (payload: MessagePayload<T>) => Promise<MessageResponse<K>> | void;
export type MessageUnsubsriber = () => void;
