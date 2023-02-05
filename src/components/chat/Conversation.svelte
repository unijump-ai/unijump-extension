<script lang="ts">
  import type { ConversationMessage } from '$lib/services/conversation';
  import ChatMessage from './ChatMessage.svelte';

  export let messages: ConversationMessage[];
  export let incomingMessage: ConversationMessage;
  export let outgoingMessage: ConversationMessage;
</script>

<ul class="mx-auto max-w-2xl pl-7">
  <li>
    {#each messages as message}
      <div class="mb-[20px]">
        <ChatMessage {message} />
      </div>
    {/each}
    {#if outgoingMessage}
      <div class="mb-[20px]">
        <ChatMessage message={outgoingMessage} />
      </div>
    {/if}
    {#if incomingMessage}
      <div class="mb-[20px]">
        <ChatMessage message={incomingMessage} />
      </div>
    {/if}
  </li>
</ul>
