<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { Button } from '$components/elements';
  import Modal from '$components/modal/Modal.svelte';
  import ModalDescription from '$components/modal/ModalDescription.svelte';
  import ModalDialog from '$components/modal/ModalDialog.svelte';
  import ModalTitle from '$components/modal/ModalTitle.svelte';
  import config from '../../config';
  import { userAgent } from '$lib/user-agent';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { isMac } from '$lib/utils';

  export let active = false;

  const dispatch = createEventDispatcher();
  const ua = userAgent.getResult();
  const shortcutPage =
    ua.engine.name === 'Blink'
      ? 'chrome://extensions/shortcuts'
      : ua.browser.name === 'Firefox'
      ? 'about:addons'
      : '';
  const defaultShortcut = isMac()
    ? config.defaultShortcut.mac
    : config.defaultShortcut.default;

  let shortcutChangeInterval: number = null;

  onDestroy(() => {
    window.clearInterval(shortcutChangeInterval);
  });

  function openShortcutPage() {
    sendMessage(Message.OPEN_TAB, shortcutPage);
    listenShortcutChange();
  }

  function listenShortcutChange() {
    shortcutChangeInterval = window.setInterval(async () => {
      const { message } = await sendMessage(Message.GET_TOGGLE_SHORTCUT, undefined);

      if (message) {
        dispatch('set-shortcut', message);
        window.clearInterval(shortcutChangeInterval);
        active = false;
      }
    }, 1000);
  }
</script>

<Modal bind:active id="toggle-shortcut">
  <ModalDialog>
    <ModalTitle>Shortcut is missing</ModalTitle>
    <ModalDescription>
      It appears that another extension is currently using the default shortcut <code
        >{defaultShortcut}</code
      >
      for UniJump. The browser's shortcuts page provides an option for you to set a new shortcut.
      {#if !shortcutPage}
        <p class="text-xs text-zinc-300 mt-3">
          * Unfortunately, your browser is unable to open the shortcut page for UniJump.
          You can set a shortcut for UniJump by accessing the extension preferences in
          your browser instead.
        </p>
      {/if}
    </ModalDescription>
    <div class="flex justify-center mt-6">
      {#if shortcutPage}
        <Button on:click={() => openShortcutPage()}>Go to shortcuts page</Button>
      {/if}
    </div>
  </ModalDialog>
</Modal>

<style lang="postcss">
  code {
    @apply text-white bg-white/10 px-1 py-0.5 rounded-md border border-white/10;
  }
</style>
