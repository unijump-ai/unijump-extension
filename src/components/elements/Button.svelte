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
    'btn font-medium text-sm text-white cursor flex rounded-full w-full justify-center items-center transition-all',
    [_class],
    {
      'py-2.5 px-4': size === 'md',
      'py-1.5 px-3': size === 'sm',
      'opacity-50 cursor-auto': disabled,
      'hover:bg-white/15': !disabled,
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
