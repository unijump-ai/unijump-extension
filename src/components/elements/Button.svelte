<script lang="ts">
  import { inlineClass } from '$lib/utils';

  let _class: string = '';

  export let size: 'xs' | 'sm' | 'md' = 'md';
  export let disabled = false;
  export let clean = false;
  export { _class as class };
</script>

<button
  class={inlineClass(
    'btn cursor flex w-full items-center justify-center rounded-full from-white/30 to-white/0 text-sm font-medium text-white transition-all',
    [_class],
    {
      'py-2.5 px-4': size === 'md',
      'py-1.5 px-3': size === 'sm',
      'cursor-auto opacity-50': disabled,
      'hover:bg-white/15 active:bg-gradient-radial-to-b': !disabled,
      'bg-white/8 ring-1 ring-inset ring-white/10': !clean,
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
