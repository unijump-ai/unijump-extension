<script lang="ts">
  import type { ScrollerController } from '$components/elements/Scroller.controller';
  import { onDestroy, tick } from 'svelte';
  import AppPage from '$components/app/AppPage.svelte';
  import ChatInput from '$components/chat/ChatInput.svelte';
  import { Scroller } from '$components/elements';
  import Conversation from '$components/chat/Conversation.svelte';
  import {
    ConversationService,
    type ConversationState,
  } from '$lib/services/conversation';
  import { errorStore, selectedText } from '$lib/store';

  const conversationService = new ConversationService();
  let scrollerController: ScrollerController | null = null;
  let inputText = $selectedText || '';

  const { store: conversationStore } = conversationService;

  $: disableSend =
    $conversationStore.incomingMessage || $conversationStore.outgoingMessage;
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
</script>

<AppPage title="Chat" on:close>
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
        disabled={!!($errorStore || disableSend)}
        on:message={onMessageSend}
      />
    </div>
  {/if}
</AppPage>
