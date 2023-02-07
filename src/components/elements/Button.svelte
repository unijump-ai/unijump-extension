<script lang="ts">
  import { inlineClass } from '$lib/utils';

  export let size: 'xs' | 'sm' | 'md' = 'md';
  export let disabled = false;
</script>

<button
  class={inlineClass(
    'btn font-medium text-sm text-white cursor flex ring-1 ring-inset ring-white/10 rounded-full w-full justify-center items-center bg-white/8 transition-all',
    {
      'py-2.5 px-4': size === 'md',
      'py-1.5 px-3': size === 'sm',
      'opacity-50 cursor-auto': disabled,
      'hover:bg-white/20': !disabled,
    }
  )}
  {disabled}
  {...$$restProps}
  on:click
>
  <slot />
</button>

<style>
  :global(.btn > svg) {
    display: inline-flex;
    margin-right: 6px;
  }
</style>
