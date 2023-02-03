<script lang="ts">
  import { UnauthorizedException } from '$lib/exceptions';
  import { sendMessage } from '$lib/messaging';
  import { Message } from '$lib/messaging/messaging.constants';
  import { errorStore } from '$lib/store';
  import { onMount } from 'svelte';

  $: message =
    $errorStore instanceof UnauthorizedException
      ? 'Please Login at'
      : 'You need to visit';

  onMount(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return;

      const { error } = await sendMessage(Message.GET_SESSION);

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
</script>

<a href="https://chat.openai.com/chat" target="_blank" rel="noreferrer">
  <p>
    {message} <span class="underline">chat.openai.com ↗</span> to continue using UniText.
  </p>
</a>
