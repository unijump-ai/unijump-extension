import api from '$lib/api';
import { ExtensionStorage } from './storage';

const tabConversations = new ExtensionStorage<Record<number, string>>('tabConversations');

export const addConversation = async (tabId: number, conversationId: string) => {
  const conversations = (await tabConversations.get()) || {};

  if (conversations[tabId] === conversationId) return;

  conversations[tabId] = conversationId;
  await tabConversations.set(conversations);
};

export const deleteConversation = async (tabId: number) => {
  const conversations = await tabConversations.get();

  if (!conversations) return;

  const conversationId = conversations[tabId];

  if (!conversationId) return;

  api.setConversationProperty(conversationId, { is_visible: false });
  delete conversations[tabId];
  await tabConversations.set(conversations);
};
