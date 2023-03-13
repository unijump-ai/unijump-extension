<script context="module" lang="ts">
  const modalCloseFunctions = [];

  export const closeModals = () => {
    modalCloseFunctions.forEach((fn) => fn());
  };
</script>

<script lang="ts">
  import SveltePortal from 'svelte-portal';
  import { createEventDispatcher, getContext, setContext } from 'svelte';
  import { AppContext } from '$lib/context';
  import { createModalStore } from './modal.store';
  import { inlineClass } from '$lib/utils';
  import { MAX_Z_INDEX } from '$lib/style';

  export let id: string;
  export let active = false;
  export let center = false;
  export let disableClose = false;
  export let mount = false;

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
        'fixed inset-0 p-4 flex items-center justify-center bg-white/30 transition-opacity z-max',
        {
          'text-center': center,
          'invisible opacity-0 pointer-events-none duration-100': !active,
          'visible opacity-100 pointer-events-auto duration-200': active,
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
