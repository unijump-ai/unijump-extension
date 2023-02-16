<script lang="ts">
  import type { ModalStore } from './modal.store';
  import { getContext, onMount } from 'svelte';
  import { AppContext } from '$lib/context';

  const modalStore = getContext(AppContext.Modal) as ModalStore;
  const modalId = modalStore.getId();

  onMount(() => {
    modalStore.markExist('title');

    return () => {
      modalStore.unmarkExist('title');
    };
  });
</script>

<h3 id="{modalId}-title" class="relative font-semibold text-xl mb-5 pb-5">
  <slot />
  <div class="absolute left-0 bottom-0 seperator" />
</h3>
