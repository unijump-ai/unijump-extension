<script lang="ts">
  import '../../../app.css';
  import { onMount } from 'svelte';
  import { listenMessage } from '$lib/extension/messaging';
  import { errorStore, selectedText } from '$lib/store';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import App from '$components/app/App.svelte';
  import AppCurtain from '$components/app/AppCurtain.svelte';

  let visible = false;

  function closeModal() {
    visible = false;
    errorStore.set(null);
  }

  onMount(() => {
    const unsubscribeOpenMessage = listenMessage(Message.OPEN_MODAL, () => {
      const selection = window.getSelection().toString();
      selectedText.set(selection || '');
      visible = true;
    });

    const unsubscribeToggleMessage = listenMessage(Message.TOGGLE_MODAL, () => {
      if (visible) {
        closeModal();
        return;
      }

      const selection = window.getSelection().toString();
      selectedText.set(selection || '');
      visible = true;
    });

    return () => {
      unsubscribeOpenMessage();
      unsubscribeToggleMessage();
    };
  });
</script>

<AppCurtain {visible} on:close={closeModal}>
  <div class="h-full w-full max-w-5xl mx-auto">
    {#if visible}
      <App on:close={closeModal} />
    {/if}
  </div>
</AppCurtain>
