<script lang="ts">
  import type { PromptEventPayload } from '$lib/prompt/prompt.types';
  import type { ConversationMessage } from '$lib/services/conversation';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import AppPage from '../app/AppPage.svelte';
  import paraphraserConfig from '$prompts/paraphraser';
  import PromptBuilder from '../prompt/PromptBuilder.svelte';
  import TextOutputActions from '$components/output/TextOutputActions.svelte';
  import { OutputAction } from '$lib/prompt/output.constants';
  import Output from '$components/output/Output.svelte';
  import { ConversationService } from '$lib/services/conversation';

  const conversationService = new ConversationService();
  const { store: conversationStore } = conversationService;

  let aiMessage: ConversationMessage = null;

  $: onConversationChange($conversationStore);
  $: loading = !!(
    $conversationStore.incomingMessage || $conversationStore.outgoingMessage
  );
  $: output = $conversationStore?.incomingMessage?.text || aiMessage?.text || '';

  onDestroy(() => {
    conversationService.clear();
    conversationService.destroy();
  });

  function onConversationChange(conversation: typeof $conversationStore) {
    if (conversation.incomingMessage || conversation.outgoingMessage) {
      aiMessage = null;
      return;
    }

    const latestAiMessage = conversationService.getLatestAiMessage();

    if (!latestAiMessage) return;

    aiMessage = latestAiMessage;
  }

  function onPromptBuilt(evt: CustomEvent<PromptEventPayload>) {
    conversationService.clear();

    const { initial, input } = evt.detail;

    const text = !aiMessage ? initial : input;
    conversationService.sendMessage(text);
  }

  function onOutputAction(evt: CustomEvent<OutputAction>) {
    switch (evt.detail) {
      case OutputAction.REWRITE:
        rewrite();
        break;
      case OutputAction.SHORTEN:
        shorten();
        break;
      case OutputAction.EXPAND:
        expand();
        break;
    }
  }

  function rewrite() {
    conversationService.sendMessage('Rewrite it.');
  }

  function shorten() {
    conversationService.sendMessage('Make it shorter.');
  }

  function expand() {
    conversationService.sendMessage('Make it longer.');
  }
</script>

<AppPage title="Paraphraser" on:close>
  {#if $conversationStore}
    <div class="grid grid-cols-2 h-full">
      <div class="h-full p-6 overflow-y-auto">
        <PromptBuilder config={paraphraserConfig} on:prompt={onPromptBuilt} />
      </div>
      <div class="relative h-full p-6 overflow-y-auto">
        <div class="absolute left-0 top-0 seperator-vertical" />
        <Output type="markdown" {output} {loading} />
        {#if aiMessage && !$conversationStore.incomingMessage}
          <div class="mt-4" in:fade={{ duration: 100 }}>
            <TextOutputActions {output} on:action={onOutputAction} />
          </div>
        {/if}
      </div>
    </div>
  {/if}
</AppPage>
