<script lang="ts">
  import '../../../app.css';
  import { onMount, setContext } from 'svelte';
  import { listenMessage } from '$lib/messaging';
  import { errorStore, selectedText } from '$lib/store';
  import App from '$components/app/App.svelte';
  import { Message } from '$lib/messaging/messaging.constants';
  import browser from 'webextension-polyfill';
  import AppCurtain from '$components/app/AppCurtain.svelte';

  setContext('getURL', (url: string) => browser.runtime.getURL(url));

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
