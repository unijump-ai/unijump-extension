import { Cache } from '$lib/decorators/cache.method';
import {
  CloudflareException,
  ExpiredSessionException,
  ModelCapExceededException,
  ServiceBusyException,
  UnauthorizedException,
  UnknownException,
} from '$lib/exceptions';
import { parseStream } from '$lib/sse';
import { v4 as uuidv4 } from 'uuid';

export interface ConversationParams {
  text: string;
  conversationId?: string;
  parentMessageId?: string;
  messageId?: string;
  modelSlug?: string;
}

export interface ConversationResponse {
  text: string;
  conversationId: string;
  messageId: string;
}

export interface ConversationProperty {
  is_visible: boolean;
  title: string;
}

export interface ApiSession {
  accessToken: string;
  expires: string;
  user: {
    id: string;
    name: string;
    picture: string;
  };
}

export interface ChatGPTModel {
  slug: string;
  title: string;
}

interface ConversationBody {
  conversation_id?: string;
  action: 'next';
  model: string;
  parent_message_id: string;
  messages: [ConversationMessage];
}

interface ConversationMessage {
  id: string;
  role: 'user';
  content: {
    content_type: 'text';
    parts: [string];
  };
}

type OnMessageCallback<T> = (message: T, done: boolean) => void;

export class Api {
  private abortController: AbortController;
  private baseUrl = 'https://chat.openai.com';
  private defaultModel: ChatGPTModel = {
    title: 'Default (GPT-3.5)',
    slug: 'text-davinci-002-render-sha',
  };

  private getFullUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  private async fetch<Res>(
    path: string,
    options: RequestInit = {},
    onSseMessage?: OnMessageCallback<Res>
  ): Promise<Res> {
    this.abortController = new AbortController();
    const { accessToken } = await this.getSession();

    const requestOptions: RequestInit = {
      signal: this.abortController.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      ...options,
    };

    const response = await fetch(this.getFullUrl(path), requestOptions);

    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedException();
      }

      if (response.status === 403) {
        throw new CloudflareException();
      }

      if (response.status === 405) {
        throw new ServiceBusyException();
      }

      const responseMessage = await response.json();

      if (responseMessage?.detail?.code === 'token_expired') {
        throw new ExpiredSessionException();
      }

      if (responseMessage?.detail?.code === 'model_cap_exceeded') {
        const clearsIn = responseMessage.detail.clears_in as number;
        const waitUntil = new Date(Date.now() + clearsIn * 1000).toLocaleTimeString();

        throw new ModelCapExceededException(waitUntil);
      }

      throw new UnknownException();
    }

    if (onSseMessage) {
      parseStream<Res>(response.body, '[DONE]', (message, done) => {
        onSseMessage(message, done);
      });
    } else {
      return response.json() as Res;
    }
  }

  private async post<T, K>(path: string, body: T, onSseMessage?: OnMessageCallback<K>) {
    const bodyString = JSON.stringify(body);

    return this.fetch(
      path,
      {
        body: bodyString,
        method: 'POST',
      },
      onSseMessage
    );
  }

  private patch<T>(path: string, body: T) {
    const bodyString = JSON.stringify(body);

    return this.fetch(path, {
      body: bodyString,
      method: 'PATCH',
    });
  }

  abortRequests() {
    this.abortController?.abort();
  }

  @Cache(1000 * 60) // 60 seconds
  async getSession(): Promise<ApiSession> {
    const response = await fetch(this.getFullUrl('/api/auth/session'));

    if (!response.ok) {
      if (response.status === 403) {
        throw new CloudflareException();
      }

      if (response.status === 405) {
        throw new ServiceBusyException();
      }

      const responseMessage = await response.json();

      // TODO: Try to get status code
      if (responseMessage?.detail?.code === 'token_expired') {
        throw new ExpiredSessionException();
      }

      throw new UnknownException();
    }

    const session = await response.json();

    if (!session.accessToken) {
      throw new UnauthorizedException();
    }

    return session;
  }

  checkUser() {
    return this.fetch('/backend-api/accounts/check');
  }

  setConversationProperty(conversationId: string, props: Partial<ConversationProperty>) {
    return this.patch(`/backend-api/conversation/${conversationId}`, props);
  }

  async fetchModels() {
    try {
      const response = await this.fetch<{ models: ChatGPTModel[] }>(
        '/backend-api/models'
      );

      return response.models;
    } catch (err) {
      return [this.defaultModel];
    }
  }

  conversation(
    params: ConversationParams,
    onMessage: (message: ConversationResponse, done: boolean) => void
  ) {
    const conversationBody: ConversationBody = {
      action: 'next',
      model: params.modelSlug || this.defaultModel.slug,
      parent_message_id: params.parentMessageId || uuidv4(),
      messages: [
        {
          id: uuidv4(),
          role: 'user',
          content: {
            content_type: 'text',
            parts: [params.text],
          },
        },
      ],
    };

    if (params.conversationId) {
      conversationBody.conversation_id = params.conversationId;
    }

    return this.post(
      '/backend-api/conversation',
      conversationBody,
      (payload: any, done: boolean) => {
        const message = payload?.message;

        if (!message) {
          onMessage(null, true);
          return;
        }

        const text = message.content?.parts?.[0];

        if (text) {
          onMessage(
            { text, messageId: message.id, conversationId: payload.conversation_id },
            done
          );
        }
      }
    );
  }
}

export default new Api();
