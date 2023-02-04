<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let visible = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function onKeydown(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      close();
    }
  }
</script>

<div
  class="fixed w-full h-full left-0 text-sm top-0 p-4 z-[9999999] transition-all {visible
    ? 'opacity-100 visible bg-white/30'
    : 'opacity-0 invisible'}"
  on:click|self={close}
  on:keydown|self={onKeydown}
>
  <slot />
</div>
