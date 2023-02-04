<script lang="ts">
  export let label;
</script>

<button
  class="p-1 bg-white/5 rounded-full hover:bg-white/20 transition-all"
  {...$$props}
  on:click
>
  <slot />
  <span class="sr-only">{label}</span>
</button>
