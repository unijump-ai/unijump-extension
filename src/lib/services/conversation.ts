import type { ConversationParams } from '$lib/api';
import type { ConnectionHandler } from '$lib/extension/messaging/messaging.types';
import type { ImageToolsSource } from 'src/types/image-tools';
import { openConnection, sendMessage } from '$lib/extension/messaging';
import { Connection, Message } from '$lib/extension/messaging/messaging.constants';
import { StoreService } from './store';
import userAvatar from '$assets/images/avatar.png?w=20;40&format=webp;png&picture';
import chatgptAvatar from '$assets/images/chatgptavatar.png?w=20;40&format=webp;png&picture';

export type ConversationRole = 'assistant' | 'user';

export interface ConversationSender {
  name: string;
  role: ConversationRole;
  picture?: ImageToolsSource;
}

export interface ConversationMessage {
  sender: ConversationSender;
  id: string;
  text: string;
  created: string;
  status: 'pending' | 'writing' | 'finished';
}

export interface ConversationState {
  messages: ConversationMessage[];
  incomingMessage: ConversationMessage;
  outgoingMessage: ConversationMessage;
  id?: string;
  error?: Error;
}

export class ConversationService extends StoreService<ConversationState> {
  private incomingMessage: ConversationMessage = null;
  private outgoingMessage: ConversationMessage = null;
  private connectionHandler: ConnectionHandler<Connection.CHAT>;

  constructor(
    private userMessages: ConversationMessage[] = [],
    private aiMessages: ConversationMessage[] = [],
    private id?: string
  ) {
    super(null);
    this.setStore();
  }

  private get state(): ConversationState {
    const messages = [...this.userMessages, ...this.aiMessages].sort((a, b) => {
      return a.created < b.created ? -1 : 1;
    });

    return {
      messages,
      incomingMessage: this.incomingMessage,
      outgoingMessage: this.outgoingMessage,
      id: this.id,
    };
  }

  private setStore(error?: Error) {
    this.setState({
      ...this.state,
      error,
    });
  }

  private createMessageId() {
    return crypto.randomUUID();
  }

  private getAiSender(): ConversationSender {
    return {
      role: 'assistant',
      name: 'Bot',
      picture: chatgptAvatar,
    };
  }

  private getSender(): ConversationSender {
    return {
      role: 'user',
      name: 'Test',
      picture: userAvatar,
    };
  }

  private createChatMessage(
    text: string,
    sender: ConversationSender,
    id = this.createMessageId(),
    status?: ConversationMessage['status']
  ): ConversationMessage {
    return {
      text,
      sender,
      id,
      created: Date.now().toString(),
      status,
    };
  }

  private createConversationPayload(message: ConversationMessage): ConversationParams {
    const conversationParams: ConversationParams = {
      text: message.text,
    };
    const latestAiMessage = this.getLatestAiMessage();

    if (latestAiMessage) {
      conversationParams.parentMessageId = latestAiMessage.id;
    }

    if (this.id) {
      conversationParams.conversationId = this.id;
    }

    return conversationParams;
  }

  getLatestAiMessage() {
    if (!this.aiMessages.length) return null;

    return this.aiMessages.at(-1);
  }

  sendMessage(text: string) {
    const chatMessage = this.createChatMessage(text, this.getSender());
    const connectionMessage = this.createConversationPayload(chatMessage);
    this.outgoingMessage = chatMessage;
    this.incomingMessage = this.createChatMessage('', this.getAiSender(), '', 'pending');
    this.setStore();

    if (this.connectionHandler) {
      return this.connectionHandler.sendMessage(connectionMessage);
    }

    this.connectionHandler = openConnection(
      Connection.CHAT,
      connectionMessage,
      (payload, error) => {
        if (error) {
          this.outgoingMessage = null;
          this.incomingMessage = null;
          this.setStore(error);
          return;
        }

        if (payload.done) {
          this.userMessages.push(this.outgoingMessage);
          this.outgoingMessage = null;

          this.aiMessages.push({ ...this.incomingMessage, status: 'finished' });
          this.incomingMessage = null;
          this.setStore();
          return;
        }

        this.incomingMessage = this.createChatMessage(
          payload.response.text,
          this.getAiSender(),
          payload.response.messageId,
          'writing'
        );
        this.id = payload.response.conversationId;
        this.setStore();
      }
    );
  }

  destroy() {
    this.connectionHandler?.disconnect();
  }

  clear() {
    if (this.id) {
      sendMessage(Message.SET_CONVERSATION_PROPERTY, {
        conversationId: this.id,
        props: { is_visible: false },
      });
    }

    this.incomingMessage = null;
    this.outgoingMessage = null;
    this.aiMessages = [];
    this.userMessages = [];
    this.id = undefined;
    this.setStore();
  }
}
