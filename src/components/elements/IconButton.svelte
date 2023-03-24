<script lang="ts">
  import { inlineClass } from '$lib/utils';

  export let label: string;
  export let flat = false;
</script>

<button
  class={inlineClass('p-1 bg-white/8 rounded-full hover:bg-white/15 transition-all', [
    flat ? 'rounded-md' : 'rounded-full',
  ])}
  {...$$props}
  on:click
>
  <slot />
  <span class="sr-only">{label}</span>
</button>
