<script lang="ts">
  import type { ScrollerController } from '$components/elements/Scroller.controller';
  import type { ListPrompt } from '$lib/services/prompt-list';
  import { onDestroy, tick } from 'svelte';
  import AppPage from '$components/app/AppPage.svelte';
  import ChatInput from '$components/chat/ChatInput.svelte';
  import { Button, Scroller } from '$components/elements';
  import Conversation from '$components/chat/Conversation.svelte';
  import {
    ConversationService,
    type ConversationState,
  } from '$lib/services/conversation';
  import { errorStore, selectedText } from '$lib/store';
  import IconPlus from '$assets/icons/plus-circle.svg?component';
  import PromptList from '$components/prompt/PromptList.svelte';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { UserEvent } from '$lib/extension/events/event.constants';
  import { PageName } from '$lib/navigation';

  const conversationService = new ConversationService();
  const { store: conversationStore } = conversationService;

  let focusInput: () => void;
  let scrollerController: ScrollerController | null = null;
  let inputText = $selectedText || '';
  let selectedPrompt: ListPrompt | null = null;

  $: messaging = $conversationStore.incomingMessage || $conversationStore.outgoingMessage;
  $: hasConversation = $conversationStore.messages.length || messaging;
  $: onConversationChange($conversationStore);

  onDestroy(destroyConversation);

  function destroyConversation() {
    conversationService.clear();
    conversationService.destroy();
  }

  async function onConversationChange({ error }: ConversationState) {
    if (error) {
      errorStore.set(error);
      return;
    }

    await tick();

    if (hasConversation) {
      scrollerController?.scrollBottom();
    } else {
      scrollerController?.scrollTop();
    }
  }

  function onMessageSend(evt: CustomEvent<string>) {
    const text = evt.detail;

    conversationService.sendMessage(text);

    sendMessage(Message.SEND_EVENT, {
      type: UserEvent.MESSAGE_SENT,
      props: {
        page: PageName.Chat,
        conversation: $conversationStore.uniqueId,
        prompt: selectedPrompt
          ? `${selectedPrompt.title} - ${selectedPrompt.list}`
          : undefined,
      },
    });

    selectedPrompt = null;
  }

  function newChat() {
    conversationService.clear();
    focusInput?.();
  }

  function onPromptListSelect(evt: CustomEvent<ListPrompt>) {
    const listPrompt = evt.detail;
    selectedPrompt = listPrompt;

    inputText = listPrompt.prompt;
    focusInput?.();
  }
</script>

<AppPage title={$conversationStore.title || 'Chat'} on:close>
  <svelte:fragment slot="header-actions">
    <Button size="sm" disabled={!!messaging} on:click={newChat}>
      <IconPlus width={16} /> New Chat
    </Button>
  </svelte:fragment>
  {#if $conversationStore}
    <div class="h-full w-full relative">
      <Scroller bind:scrollerController>
        <div class="p-6 pb-24">
          {#if hasConversation}
            <Conversation
              messages={$conversationStore.messages}
              incomingMessage={$conversationStore.incomingMessage}
              outgoingMessage={$conversationStore.outgoingMessage}
            />
          {:else}
            <PromptList on:select={onPromptListSelect} />
          {/if}
        </div>
      </Scroller>
      <ChatInput
        {inputText}
        disabled={!!($errorStore || messaging)}
        on:message={onMessageSend}
        bind:focus={focusInput}
      />
    </div>
  {/if}
</AppPage>
