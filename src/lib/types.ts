export interface Answer {
  text: string;
  conversationId: string;
  messageId: string;
}

export interface PromptEventPayload {
  input: string;
  initial: string;
}

export type ChatRole = 'assistant' | 'user';

export interface ChatMessageSender {
  name: string;
  role: ChatRole;
  picture?: string;
}

export interface ChatMessage {
  sender: ChatMessageSender;
  id: string;
  text: string;
  created: string;
  status: 'pending' | 'writing' | 'finished';
}

export interface ChatConversation {
  messages: ChatMessage[];
  id: string;
}

// Image tools
export type ImageToolsFormats = 'webp' | 'avif' | 'png' | 'jpg';

export interface ImageToolsImage {
  src: string;
  w: string;
}

export type ImageToolsSources = Record<ImageToolsFormats, ImageToolsImage[]>;

export interface ImageToolsSource {
  sources: ImageToolsSources;
  fallback: ImageToolsImage;
}
