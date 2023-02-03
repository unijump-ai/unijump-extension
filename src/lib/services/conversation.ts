import type { ConversationParams } from '$lib/api';
import type { ChatMessage, ChatMessageSender } from '$lib/types';
import type { ConnectionHandler } from '$lib/messaging/messaging.types';
import { openConnection, sendMessage } from '$lib/messaging';
import { Connection, Message } from '$lib/messaging/messaging.constants';
import { StoreService } from './store';
import userAvatar from '$assets/images/avatar.png';
import chatgptAvatar from '$assets/images/chatgptavatar.png';

export interface ConversationState {
  messages: ChatMessage[];
  incomingMessage: ChatMessage;
  outgoingMessage: ChatMessage;
  id?: string;
  error?: Error;
}

export class ConversationService extends StoreService<ConversationState> {
  private incomingMessage: ChatMessage = null;
  private outgoingMessage: ChatMessage = null;
  private connectionHandler: ConnectionHandler<Connection.CHAT>;

  constructor(
    private userMessages: ChatMessage[] = [],
    private aiMessages: ChatMessage[] = [],
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

  private getAiSender(): ChatMessageSender {
    return {
      role: 'assistant',
      name: 'Bot',
      picture: chatgptAvatar,
    };
  }

  private getSender(): ChatMessageSender {
    return {
      role: 'user',
      name: 'Test',
      picture: userAvatar,
    };
  }

  private createChatMessage(
    text: string,
    sender: ChatMessageSender,
    id = this.createMessageId(),
    status?: ChatMessage['status']
  ): ChatMessage {
    return {
      text,
      sender,
      id,
      created: Date.now().toString(),
      status,
    };
  }

  private createConversationPayload(message: ChatMessage): ConversationParams {
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
          payload.answer.text,
          this.getAiSender(),
          payload.answer.messageId,
          'writing'
        );
        this.id = payload.answer.conversationId;
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
