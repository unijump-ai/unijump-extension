<script lang="ts">
  import type { ScrollerController } from '$components/elements/Scroller.controller';
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

  const conversationService = new ConversationService();
  let focusInput: () => void;
  let scrollerController: ScrollerController | null = null;
  let inputText = $selectedText || '';

  const { store: conversationStore } = conversationService;

  $: messaging = $conversationStore.incomingMessage || $conversationStore.outgoingMessage;
  $: onConversationChange($conversationStore);

  onDestroy(() => {
    conversationService.destroy();
  });

  async function onConversationChange({ error, outgoingMessage }: ConversationState) {
    if (error) {
      errorStore.set(error);

      if (outgoingMessage) {
        inputText = outgoingMessage.text;
      }
    }

    await tick();
    scrollerController?.scrollBottom();
  }

  function onMessageSend(evt: CustomEvent<string>) {
    const text = evt.detail;

    conversationService.sendMessage(text);
  }

  function newChat() {
    conversationService.clear();
    focusInput?.();
  }
</script>

<AppPage title="Chat" on:close>
  <svelte:fragment slot="header-actions">
    <Button size="sm" disabled={!!messaging} on:click={newChat}>
      <IconPlus width={16} /> New Chat
    </Button>
  </svelte:fragment>
  {#if $conversationStore}
    <div class="h-full w-full relative">
      <Scroller bind:scrollerController>
        <div class="p-6 pb-20">
          <Conversation
            messages={$conversationStore.messages}
            incomingMessage={$conversationStore.incomingMessage}
            outgoingMessage={$conversationStore.outgoingMessage}
          />
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
