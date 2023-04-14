<script lang="ts">
  import { inlineClass } from '$lib/utils';

  let _class: string = '';

  export let label: string;
  export let flat = false;
  export { _class as class };
</script>

<button
  class={inlineClass(
    'rounded-full bg-white/8 from-white/30 to-white/0 p-1 transition-all hover:bg-white/15 active:bg-gradient-radial-to-b',
    [_class, flat ? 'rounded-md' : 'rounded-full']
  )}
  {...$$restProps}
  on:click
>
  <slot />
  <span class="sr-only">{label}</span>
</button>
