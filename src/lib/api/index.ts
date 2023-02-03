import type { Answer } from '$lib/types';
import { CacheKey, getCache, setCache } from '$lib/cache';
import {
  CloudflareException,
  ServiceBusyException,
  SseException,
  UnauthorizedException,
  UnknownException,
} from '$lib/exceptions';
import { parseStream } from '$lib/sse';

export interface ConversationParams {
  text: string;
  conversationId?: string;
  parentMessageId?: string;
  messageId?: string;
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

interface ConversationBody {
  conversation_id?: string;
  action: 'next';
  model: 'text-davinci-002-render';
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

  private getFullUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  private async fetch<Res>(
    path: string,
    options: RequestInit = {},
    onSseMessage?: OnMessageCallback<Res>
  ): Promise<void | Res> {
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
      throw new SseException();
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

  abortRequests() {
    this.abortController?.abort();
  }

  async getSession(): Promise<ApiSession> {
    const sessionCache = getCache(CacheKey.SESSION);

    if (sessionCache) {
      return sessionCache;
    }

    const response = await fetch(this.getFullUrl('/api/auth/session'));

    if (!response.ok) {
      if (response.status === 403) {
        throw new CloudflareException();
      }

      if (response.status === 405) {
        throw new ServiceBusyException();
      }

      throw new UnknownException();
    }

    const session = await response.json();

    if (!session.accessToken) {
      throw new UnauthorizedException();
    }

    setCache(CacheKey.SESSION, session);

    return session;
  }

  conversation(
    params: ConversationParams,
    onMessage: (message: Answer, done: boolean) => void
  ) {
    const conversationBody: ConversationBody = {
      action: 'next',
      model: 'text-davinci-002-render',
      parent_message_id: params.parentMessageId || crypto.randomUUID(),
      messages: [
        {
          id: crypto.randomUUID(),
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

        console.log('payload', payload);
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
