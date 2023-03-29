<script lang="ts">
  import config from '$config';
  import { ExpiredSessionException, UnauthorizedException } from '$lib/exceptions';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { errorStore } from '$lib/store';

  const messages = {
    [UnauthorizedException.name]: 'Please Login at',
    [ExpiredSessionException.name]: 'Your session has expired. Please go to',
  };

  $: message = messages[$errorStore?.name] || 'You need to visit';

  async function onChatGptClick(evt: MouseEvent) {
    evt.preventDefault();

    const { response } = await sendMessage(
      Message.OPEN_CHATGPT_TAB,
      config.chatGPT.chatUrl
    );

    if (response) {
      errorStore.set(null);
    }
  }
</script>

<a
  href={config.chatGPT.chatUrl}
  target="_blank"
  rel="noreferrer"
  on:click={onChatGptClick}
>
  <p>
    {message} <span class="underline">{config.chatGPT.baseUrl} ↗</span> to continue using UniJump.
  </p>
</a>
