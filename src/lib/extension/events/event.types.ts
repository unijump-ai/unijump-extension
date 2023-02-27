import type { PageName } from '$lib/navigation';
import type UAParser from 'ua-parser-js';
import type { APP_OPEN_SOURCE, UserEvent } from './event.constants';

export interface ExtensionInfo {
  ua: UAParser.IResult;
  version: string;
  deviceId: string;
  userId: string;
}

export interface EventAdapter<T = any> {
  name: string;
  transform?: (
    eventType: string,
    props: Record<string, any> | null,
    // userAgent?: UAParser.UAParserInstance
    extensionInfo: ExtensionInfo
  ) => Promise<T> | T;
  send: (payload: {
    type: string;
    props?: Record<string, any>;
    transformed?: T;
  }) => void | Promise<void>;
}

export type UserEventMessage =
  | { type: UserEvent.APP_OPEN; props: { 'opened-from': APP_OPEN_SOURCE } }
  | { type: UserEvent.EXTENSION_INSTALL; props?: {} }
  | { type: UserEvent.PROMPT_SAVE; props: { prompt: string } }
  | { type: UserEvent.PROMPT_UNSAVE; props: { prompt: string } }
  | {
      type: UserEvent.MESSAGE_SENT;
      props: {
        page: PageName;
        conversation: string;
        prompt?: string;
        action?: string;
        tags?: string[];
      };
    };
