<script lang="ts">
  import { Button } from '$components/elements';
  import { Modal, ModalDescription, ModalDialog, ModalTitle } from '$components/modal';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { options } from '$lib/store';

  export let host: string;
  export let websiteName: string;
  export let active = false;

  function closeModal() {
    active = false;
  }

  function hideToolbox() {
    options.toggleToolboxHost(host);
    closeModal();
  }

  function openOptionsPage() {
    sendMessage(Message.OPEN_OPTIONS_PAGE, undefined);
  }
</script>

<Modal bind:active id="toolbar-hide">
  <ModalDialog>
    <ModalTitle>Hide UniJump toolbar</ModalTitle>
    <ModalDescription
      >You are about to hide the UniJump toolbar for {websiteName}. However, you have the
      option to turn it back on by accessing the
      <button class="underline text-white" on:click={() => openOptionsPage()}
        >UniJump Options</button
      > page.</ModalDescription
    >
    <div class="grid grid-cols-2 gap-2 mt-6">
      <Button on:click={() => hideToolbox()}>Hide</Button>
      <Button on:click={() => closeModal()} clean>Cancel</Button>
    </div>
  </ModalDialog>
</Modal>
