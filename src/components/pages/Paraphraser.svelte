<script lang="ts">
  import SelectModel from '$components/app/SelectModel.svelte';
  import type { ScrollerController } from '$components/elements/Scroller.controller';
  import Scroller from '$components/elements/Scroller.svelte';
  import Output from '$components/output/Output.svelte';
  import TextOutputActions from '$components/output/TextOutputActions.svelte';
  import { appManager } from '$lib/app';
  import { UserEvent } from '$lib/extension/events/event.constants';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { PageName } from '$lib/navigation';
  import { PromptManager } from '$lib/prompt';
  import { OutputAction } from '$lib/prompt/output.constants';
  import type { PromptEventPayload } from '$lib/prompt/prompt.types';
  import type { ConversationMessage } from '$lib/services/conversation';
  import { ConversationService } from '$lib/services/conversation';
  import { activePage, appModalVisible, errorStore, pageAction } from '$lib/store';
  import { injectToInput } from '$lib/toolbox';
  import { sleep } from '$lib/utils';
  import paraphraserConfig from '$prompts/paraphraser';
  import { createEventDispatcher, onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import AppPage from '../app/AppPage.svelte';
  import PromptBuilder from '../prompt/PromptBuilder.svelte';

  const dispatch = createEventDispatcher();
  const conversationService = new ConversationService();
  const { store: conversationStore } = conversationService;
  const { store: appStore } = appManager;

  let buildPrompt: () => Promise<void>;
  let focusPromptBuilder: () => Promise<void>;
  let outputScroller: ScrollerController | null = null;
  let aiMessage: ConversationMessage = null;
  let selectedPromptArgs = PromptManager.createEmptyArgs(paraphraserConfig);

  $: onConversationChange($conversationStore);
  $: loading = !!(
    $conversationStore.incomingMessage || $conversationStore.outgoingMessage
  );
  $: output = $conversationStore?.incomingMessage?.text || aiMessage?.text || '';
  $: isActivePage = $activePage === PageName.Paraphraser;
  $: selectedModel = $appStore.selectedModel;
  $: onVisibilityChange($appModalVisible, isActivePage);
  $: onSelectedModelChange(selectedModel);

  onDestroy(destroyConversation);

  function destroyConversation() {
    conversationService.clear();
    conversationService.destroy();
  }

  async function onVisibilityChange($appModalVisible: boolean, isActivePage: boolean) {
    if (!$appModalVisible || !isActivePage) return;

    if ($pageAction && $pageAction.page === PageName.Paraphraser) {
      selectedPromptArgs = $pageAction.args;

      if ($pageAction.run) {
        await sleep(200);
        buildPrompt();
      } else {
        await sleep(200);
        focusPromptBuilder?.();
      }
    } else {
      setTimeout(() => {
        focusPromptBuilder?.();
      }, 200);
    }
  }

  async function onConversationChange(conversation: typeof $conversationStore) {
    if (conversation.error) {
      errorStore.set(conversation.error);
      conversationService.clear();
      return;
    }

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

  function onSelectedModelChange(_) {
    aiMessage = null;
  }

  function onPromptBuilt(evt: CustomEvent<PromptEventPayload>) {
    const { initial, args } = evt.detail;

    conversationService.clear();
    conversationService.sendMessage(initial, selectedModel);

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
      case OutputAction.INJECT:
        inject();
        break;
    }
  }

  function rewrite() {
    conversationService.sendMessage('Rewrite it.', selectedModel);
    sendMessageEvent(OutputAction.REWRITE);
  }

  function shorten() {
    conversationService.sendMessage('Make it shorter.', selectedModel);
    sendMessageEvent(OutputAction.SHORTEN);
  }

  function expand() {
    conversationService.sendMessage('Make it longer.', selectedModel);
    sendMessageEvent(OutputAction.EXPAND);
  }

  async function inject() {
    if (!$pageAction?.input?.element) return;

    const injected = await injectToInput($pageAction.input.element, output);

    if (injected) {
      dispatch('close');
    } else {
      alert('Inject input is missing at the moment!');
    }
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
  <svelte:fragment slot="header-actions">
    <SelectModel />
  </svelte:fragment>
  {#if $conversationStore}
    <div class="grid grid-cols-2 h-full">
      <PromptBuilder
        config={paraphraserConfig}
        {loading}
        bind:selectedPromptArgs
        bind:build={buildPrompt}
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
