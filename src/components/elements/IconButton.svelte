<script lang="ts">
  import { inlineClass } from '$lib/utils';

  let _class: string = '';

  export let label: string;
  export let flat = false;
  export { _class as class };
</script>

<button
  class={inlineClass('p-1 bg-white/8 rounded-full hover:bg-white/15 transition-all', [
    _class,
    flat ? 'rounded-md' : 'rounded-full',
  ])}
  {...$$restProps}
  on:click
>
  <slot />
  <span class="sr-only">{label}</span>
</button>
