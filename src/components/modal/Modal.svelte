<script context="module" lang="ts">
  const modalCloseFunctions = [];

  export const closeModals = () => {
    modalCloseFunctions.forEach((fn) => fn());
  };
</script>

<script lang="ts">
  import { AppContext } from '$lib/context';
  import { inlineClass } from '$lib/utils';
  import { createEventDispatcher, getContext, setContext } from 'svelte';
  import SveltePortal from 'svelte-portal';
  import { createModalStore } from './modal.store';

  export let id: string;
  export let active = false;
  export let center = false;
  export let disableClose = false;
  export let mount = false;
  export let curtain = true;

  const appRoot = (getContext(AppContext.Root) as HTMLElement) || document.body;
  const dispatch = createEventDispatcher();
  const modalStore = createModalStore(id, close);

  setContext(AppContext.Modal, modalStore);
  modalCloseFunctions.push(close);

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

{#if mount || active}
  <SveltePortal target={appRoot}>
    <div
      {id}
      class={inlineClass(
        'fixed inset-0 z-max flex items-center justify-center p-4 font-sans transition-opacity',
        {
          'bg-white/30': curtain,
          'text-center': center,
          'pointer-events-none invisible opacity-0 duration-100': !active,
          'pointer-events-auto visible opacity-100 duration-200': active,
        }
      )}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      on:click|self={close}
      {...props}
    >
      <slot />
    </div>
  </SveltePortal>
{/if}
