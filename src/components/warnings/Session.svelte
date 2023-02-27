<script lang="ts">
  import { UnauthorizedException } from '$lib/exceptions';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { errorStore } from '$lib/store';
  import { onMount } from 'svelte';

  const chatGptUrl = 'https://chat.openai.com/chat';

  $: message =
    $errorStore instanceof UnauthorizedException
      ? 'Please Login at'
      : 'You need to visit';

  onMount(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return;

      const { error } = await sendMessage(Message.GET_SESSION, undefined);

      if (error) {
        return;
      }

      errorStore.set(null);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  function onChatGptClick(evt: MouseEvent) {
    evt.preventDefault();
    sendMessage(Message.OPEN_CHATGPT_TAB, chatGptUrl);
  }
</script>

<a href={chatGptUrl} target="_blank" rel="noreferrer" on:click={onChatGptClick}>
  <p>
    {message} <span class="underline">chat.openai.com ↗</span> to continue using UniJump.
  </p>
</a>
