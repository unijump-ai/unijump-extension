<script lang="ts">
  import type { ModalStore } from './modal.store';
  import { getContext } from 'svelte';
  import { AppContext } from '$lib/context';
  import IconClose from '$assets/icons/close.svg?component';
  import IconButton from '$components/elements/IconButton.svelte';

  export let disableClose = false;

  const modalStore = getContext(AppContext.Modal) as ModalStore;

  const closeModal = () => modalStore.close();
</script>

<div class="relative w-[490px] rounded-2xl bg-modal p-6 py-5 text-white">
  {#if !disableClose}
    <span class="absolute top-3 right-4 p-2 z-20">
      <IconButton label="Close modal" on:click={closeModal}>
        <IconClose width={16} />
      </IconButton>
    </span>
  {/if}
  <slot />
</div>
