<script lang="ts">
  import type { ModalStore } from './modal.store';
  import { AppContext } from '$lib/context';
  import { getContext, onMount } from 'svelte';

  const modalStore = getContext(AppContext.Modal) as ModalStore;
  const modalId = modalStore.getId();

  onMount(() => {
    modalStore.markExist('description');

    return () => {
      modalStore.unmarkExist('description');
    };
  });
</script>

<p id="{modalId}-description" class="font-medium text-sm text-zinc-100">
  <slot />
</p>
