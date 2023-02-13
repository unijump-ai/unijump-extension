<script lang="ts">
  import '../../../app.css';
  import { onMount } from 'svelte';
  import { listenMessage } from '$lib/extension/messaging';
  import { errorStore, selectedText } from '$lib/store';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import App from '$components/app/App.svelte';
  import AppCurtain from '$components/app/AppCurtain.svelte';
  import { shortcut } from '$lib/shortcuts';

  let visible = false;
  let appWrapperEl: HTMLDivElement;

  function openModal() {
    const selection = window.getSelection().toString();
    selectedText.set(selection || '');
    visible = true;
    appWrapperEl?.focus();
  }

  function closeModal() {
    visible = false;
    errorStore.set(null);
  }

  function toggleModal() {
    if (visible) {
      closeModal();
      return;
    }

    openModal();
  }

  onMount(() => {
    shortcut('cmd+u, ctrl+u', (evt) => {
      evt.preventDefault();

      toggleModal();
    });

    const unsubscribeOpenMessage = listenMessage(Message.OPEN_MODAL, () => {
      openModal();
    });

    const unsubscribeToggleMessage = listenMessage(Message.TOGGLE_MODAL, () => {
      toggleModal();
    });

    return () => {
      unsubscribeOpenMessage();
      unsubscribeToggleMessage();
    };
  });
</script>

<AppCurtain {visible} on:close={closeModal}>
  <div class="h-full w-full max-w-5xl mx-auto" bind:this={appWrapperEl}>
    {#if visible}
      <App on:close={closeModal} />
    {/if}
  </div>
</AppCurtain>
