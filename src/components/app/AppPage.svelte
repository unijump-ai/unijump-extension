<script lang="ts">
  import IconClose from '$assets/icons/close.svg?component';
  import IconButton from '$components/elements/IconButton.svelte';
  import { createEventDispatcher } from 'svelte';

  export let title: string;

  const dispatch = createEventDispatcher();

  function onClose() {
    dispatch('close');
  }
</script>

<div class="grid grid-rows-[60px_1fr] h-full">
  <header class="relative flex justify-between items-center px-6">
    <h1 class="flex-1 text-xl font-semibold">{title}</h1>
    <div class="mr-4 grid grid-flow-col auto-cols-max gap-2">
      <slot name="header-actions" />
    </div>
    <IconButton on:click={onClose} label="Close App">
      <IconClose width={16} />
    </IconButton>
    <div class="absolute left-0 bottom-0 seperator" />
  </header>
  <div class="overflow-hidden">
    <slot />
  </div>
</div>
