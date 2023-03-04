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
  const shortcutPage = ua.engine.name === 'Blink' ? 'chrome://extensions/shortcuts' : '';
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
    </ModalDescription>
    {#if shortcutPage}
      <div class="flex justify-center mt-6">
        <Button on:click={() => openShortcutPage()}>Go to shortcuts page</Button>
      </div>
    {/if}
    <p class="font-medium text-sm italic mt-5">
      Still not working? <a
        class="underline"
        href="https://beautiful-birth-073.notion.site/Troubleshooting-Shortcut-Problem-eabb861b3cb7418bbb6eaa3269d7c1c9"
        target="_blank"
        rel="noreferrer"
        >Click here
      </a> for a possible solution.
    </p>
  </ModalDialog>
</Modal>

<style lang="postcss">
  code {
    @apply text-white bg-white/10 px-1 py-0.5 rounded-md border border-white/10;
  }
</style>
