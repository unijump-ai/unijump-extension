<script lang="ts">
  import type { ScrollerController } from '$components/elements/Scroller.controller';
  import Scroller from '$components/elements/Scroller.svelte';
  import Output from '$components/output/Output.svelte';
  import TextOutputActions from '$components/output/TextOutputActions.svelte';
  import { UserEvent } from '$lib/extension/events/event.constants';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { PageName } from '$lib/navigation';
  import { OutputAction } from '$lib/prompt/output.constants';
  import type { PromptEventPayload } from '$lib/prompt/prompt.types';
  import type { ConversationMessage } from '$lib/services/conversation';
  import { ConversationService } from '$lib/services/conversation';
  import { activePage, appModalVisible } from '$lib/store';
  import paraphraserConfig from '$prompts/paraphraser';
  import { onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import AppPage from '../app/AppPage.svelte';
  import PromptBuilder from '../prompt/PromptBuilder.svelte';

  const conversationService = new ConversationService();
  const { store: conversationStore } = conversationService;

  let focusPromptBuilder: () => Promise<void>;
  let outputScroller: ScrollerController | null = null;
  let aiMessage: ConversationMessage = null;

  $: onConversationChange($conversationStore);
  $: loading = !!(
    $conversationStore.incomingMessage || $conversationStore.outgoingMessage
  );
  $: output = $conversationStore?.incomingMessage?.text || aiMessage?.text || '';
  $: isActivePage = $activePage === PageName.Paraphraser;
  $: onVisibilityChange($appModalVisible, isActivePage);

  onDestroy(destroyConversation);

  function destroyConversation() {
    conversationService.clear();
    conversationService.destroy();
  }

  function onVisibilityChange($appModalVisible: boolean, isActivePage: boolean) {
    if ($appModalVisible && isActivePage) {
      setTimeout(() => {
        focusPromptBuilder?.();
      }, 200);
    }
  }

  async function onConversationChange(conversation: typeof $conversationStore) {
    if (conversation.incomingMessage || conversation.outgoingMessage) {
      aiMessage = null;
      return;
    }

    const latestAiMessage = conversationService.getLatestAiMessage();

    if (!latestAiMessage) return;

    aiMessage = latestAiMessage;
    await tick();
    outputScroller?.scrollBottom();
  }

  function onPromptBuilt(evt: CustomEvent<PromptEventPayload>) {
    const { initial, input, args } = evt.detail;

    const text = !aiMessage ? initial : input;
    conversationService.sendMessage(text);

    const tags = Object.values(args).reduce(
      (tags, argTags) => [...tags, ...argTags.map((a) => a.value)],
      [] as string[]
    );

    sendMessageEvent('paraphrase', tags);
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
    sendMessageEvent(OutputAction.REWRITE);
  }

  function shorten() {
    conversationService.sendMessage('Make it shorter.');
    sendMessageEvent(OutputAction.SHORTEN);
  }

  function expand() {
    conversationService.sendMessage('Make it longer.');
    sendMessageEvent(OutputAction.EXPAND);
  }

  function sendMessageEvent(action: string, tags: string[] = []) {
    sendMessage(Message.SEND_EVENT, {
      type: UserEvent.MESSAGE_SENT,
      props: {
        page: PageName.Paraphraser,
        conversation: $conversationStore.uniqueId,
        action,
        tags,
      },
    });
  }
</script>

<AppPage title="Paraphraser" on:close>
  {#if $conversationStore}
    <div class="grid grid-cols-2 h-full">
      <PromptBuilder
        config={paraphraserConfig}
        bind:focus={focusPromptBuilder}
        on:prompt={onPromptBuilt}
      />
      <div class="relative h-full overflow-hidden">
        <div class="absolute left-0 top-0 seperator-vertical" />
        <Scroller bind:scrollerController={outputScroller}>
          <div class="p-6">
            <Output type="markdown" {output} {loading} />
            {#if aiMessage && !$conversationStore.incomingMessage}
              <div class="mt-4" in:fade={{ duration: 100 }}>
                <TextOutputActions {output} on:action={onOutputAction} />
              </div>
            {/if}
          </div>
        </Scroller>
      </div>
    </div>
  {/if}
</AppPage>
