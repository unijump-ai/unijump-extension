<script lang="ts">
  import IconPlus from '$assets/icons/plus-circle.svg?component';
  import AppPage from '$components/app/AppPage.svelte';
  import SelectModel from '$components/app/SelectModel.svelte';
  import ChatInput from '$components/chat/ChatInput.svelte';
  import Conversation from '$components/chat/Conversation.svelte';
  import { Button, Scroller } from '$components/elements';
  import type { ScrollerController } from '$components/elements/Scroller.controller';
  import PromptList from '$components/prompt/PromptList.svelte';
  import { appManager } from '$lib/app';
  import { UserEvent } from '$lib/extension/events/event.constants';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { PageName } from '$lib/navigation';
  import {
    ConversationService,
    type ConversationState,
  } from '$lib/services/conversation';
  import type { ListPrompt } from '$lib/services/prompt-list';
  import {
    activePage,
    appModalVisible,
    errorStore,
    pageAction,
    selectedText,
  } from '$lib/store';
  import { sleep } from '$lib/utils';
  import { onDestroy, tick } from 'svelte';

  const conversationService = new ConversationService();
  const { store: conversationStore } = conversationService;
  const { store: appStore } = appManager;

  let focusInput: () => void;
  let scrollerController: ScrollerController | null = null;
  let inputText = $selectedText || '';
  let selectedPrompt: ListPrompt | null = null;

  $: messaging = $conversationStore.incomingMessage || $conversationStore.outgoingMessage;
  $: hasConversation = $conversationStore.messages.length || messaging;
  $: onConversationChange($conversationStore);
  $: isActivePage = $activePage === PageName.Chat;
  $: onVisibilityChange($appModalVisible, isActivePage);

  onDestroy(destroyConversation);

  function destroyConversation() {
    conversationService.clear();
    conversationService.destroy();
  }

  async function onVisibilityChange($appModalVisible: boolean, isActivePage: boolean) {
    if (!$appModalVisible || !isActivePage) return;

    if ($pageAction && $pageAction.page === PageName.Chat) {
      conversationService.clear();

      const message = $pageAction.args.chat[0].value;
      if ($pageAction.run) {
        inputText = '';
        await sleep(200);
        send(message);
      } else {
        inputText = message;
        await sleep(200);
        focusInput?.();
      }
    } else {
      await sleep(300);
      focusInput?.();
    }
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
    send(text);
  }

  function send(text: string) {
    conversationService.sendMessage(text, $appStore.selectedModel);

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
    <SelectModel disabled={!!hasConversation} />
    <Button class="" size="sm" disabled={!!messaging} on:click={newChat}>
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
