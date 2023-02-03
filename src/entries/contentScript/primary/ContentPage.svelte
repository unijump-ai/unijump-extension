<script lang="ts">
  import '../../../app.css';
  import { onMount, setContext } from 'svelte';
  import { listenMessage } from '$lib/messaging';
  import { errorStore, selectedText } from '$lib/store';
  import App from '$components/app/App.svelte';
  import { Message } from '$lib/messaging/messaging.constants';
  import browser from 'webextension-polyfill';

  setContext('getURL', (url: string) => browser.runtime.getURL(url));

  let visible = false;

  function closeModal() {
    visible = false;
    errorStore.set(null);
  }

  onMount(() => {
    const unsubscribeOpenMessage = listenMessage(Message.OPEN_MODAL, (message) => {
      const selection = window.getSelection().toString();
      selectedText.set(selection || '');
      visible = true;
    });

    const unsubscribeToggleMessage = listenMessage(Message.TOGGLE_MODAL, (message) => {
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

<div
  class="fixed w-full h-full left-0 text-sm top-0 p-4 z-[9999999] transition-all {visible
    ? 'opacity-100 visible bg-white/30'
    : 'opacity-0 invisible'}"
>
  <div class="h-full w-full max-w-5xl mx-auto">
    {#if visible}
      <App on:close={closeModal} />
    {/if}
  </div>
</div>
