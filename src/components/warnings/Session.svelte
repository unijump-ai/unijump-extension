<script lang="ts">
  import { UnauthorizedException } from '$lib/exceptions';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { errorStore } from '$lib/store';

  const chatGptUrl = 'https://chat.openai.com/chat';

  $: message =
    $errorStore instanceof UnauthorizedException
      ? 'Please Login at'
      : 'You need to visit';

  async function onChatGptClick(evt: MouseEvent) {
    evt.preventDefault();

    const { response } = await sendMessage(Message.OPEN_CHATGPT_TAB, chatGptUrl);

    if (response) {
      errorStore.set(null);
    }
  }
</script>

<a href={chatGptUrl} target="_blank" rel="noreferrer" on:click={onChatGptClick}>
  <p>
    {message} <span class="underline">chat.openai.com ↗</span> to continue using UniJump.
  </p>
</a>
