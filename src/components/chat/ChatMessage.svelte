<script lang="ts">
  import Markdown from '$components/elements/Markdown.svelte';
  import type { ChatMessage } from '$lib/types';

  export let message: ChatMessage;
</script>

<div class="relative">
  <img
    class="absolute -left-7 w-[20px] h-[20px]"
    src={message.sender.picture}
    alt="avatar"
  />
  <div
    class="font-medium inline-flex m-0 px-4 py-3 max-w-full border-1 border-white/10 rounded-[10px] {message
      .sender.role === 'user'
      ? 'bg-darkPurple-600'
      : 'bg-white/8'}"
  >
    {#if message.writing}
      <p class="flex gap-0.5">
        <span
          class="inline-flex w-1 h-1 rounded-full bg-white animate-pulse animation-delay-500"
        />
        <span
          class="inline-flex w-1 h-1 rounded-full bg-white animate-pulse animation-delay-300"
        />
        <span class="inline-flex w-1 h-1 rounded-full bg-white animate-pulse" />
      </p>
    {:else}
      <Markdown source={message.text} />
    {/if}
  </div>
</div>
