<script lang="ts">
  import IconCopy from '$assets/icons/copy.svg?component';
  import LoadingDots from '$components/elements/LoadingDots.svelte';
  import Markdown from '$components/elements/Markdown.svelte';
  import Picture from '$components/elements/Picture.svelte';
  import type { ConversationMessage } from '$lib/services/conversation';

  export let message: ConversationMessage;

  function copyMessage() {
    navigator.clipboard.writeText(message.text);
  }
</script>

<div class="relative select-text">
  <div class="absolute -left-7">
    <Picture
      width={20}
      image={message.sender.picture}
      alt="{message.sender.name} avatar"
    />
  </div>
  <div
    class="font-medium relative inline-flex text-sm select-text m-0 px-4 py-3 max-w-full border-1 border-white/10 rounded-[10px] {message
      .sender.role === 'user'
      ? 'bg-darkPurple-600'
      : 'bg-white/8'}"
  >
    {#if message.status === 'pending'}
      <LoadingDots as="p" />
    {:else}
      {#if message.sender.role !== 'user' && message.status === 'finished'}
        <button
          class="absolute -right-8 top-0 p-2 opacity-30 hover:opacity-100 transition-all"
          on:click={copyMessage}
        >
          <IconCopy width={16} height={16} />
        </button>
      {/if}
      {#if message.sender.role === 'user'}
        <p class="whitespace-pre-wrap">{message.text}</p>
      {:else}
        <Markdown source={message.text} />
      {/if}
    {/if}
  </div>
</div>
