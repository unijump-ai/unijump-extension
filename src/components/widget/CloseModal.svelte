<script lang="ts">
  import { Button } from '$components/elements';
  import { Modal, ModalDescription, ModalDialog, ModalTitle } from '$components/modal';
  import { options } from '$lib/store';

  export let active = false;
  export let shortcut = '';
</script>

<Modal bind:active id="floating-close">
  <ModalDialog>
    <ModalTitle>Hide UniJump widget</ModalTitle>
    <ModalDescription
      >You're about to hide UniJump widget. You can still open it with
      {#if shortcut}
        <code
          class="uppercase bg-white/10 border border-white/8 text-xs px-1 py-0.5 rounded-md font-sans tracking-[3px]"
        >
          {shortcut}
        </code> shortcut or
      {/if}
      by clicking on the UniJump icon in the browser toolbar.</ModalDescription
    >
    <div class="grid grid-cols-2 gap-2 mt-6">
      <Button on:click={() => options.toggleWidgetHost(window.location.host)}
        >Hide for this website</Button
      >
      <Button clean on:click={() => options.updateWidgetDisabled(true)}
        >Hide for all websites</Button
      >
    </div>
  </ModalDialog>
</Modal>
