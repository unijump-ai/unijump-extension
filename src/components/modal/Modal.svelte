<script lang="ts">
  import SveltePortal from 'svelte-portal';
  import { createEventDispatcher, getContext, setContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { focus, overflow } from '$lib/actions';
  import { AppContext } from '$lib/context';
  import { createModalStore } from './modal.store';
  import { inlineClass } from '$lib/utils';

  export let id: string;
  export let active = false;
  export let center = false;
  export let disableClose = false;

  const appRoot = (getContext(AppContext.Root) as HTMLElement) || document.body;
  const dispatch = createEventDispatcher();
  const modalStore = createModalStore(id, close);

  setContext(AppContext.Modal, modalStore);

  $: props = {
    'aria-labelledby': $modalStore.title ? `${id}-title` : null,
    'aria-describedby': $modalStore.description ? `${id}-description` : null,
  };

  function close() {
    if (disableClose) {
      return;
    }

    active = false;
    dispatch('close');
  }
</script>

{#if active}
  <SveltePortal target={appRoot}>
    <div
      {id}
      class={inlineClass(
        'fixed inset-0 p-4 z-[99999999] flex items-center justify-center bg-white/30',
        { 'text-center': center }
      )}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      use:focus
      use:overflow
      on:click|self={close}
      {...props}
      transition:fade={{ duration: 100 }}
    >
      <slot />
    </div>
  </SveltePortal>
{/if}
