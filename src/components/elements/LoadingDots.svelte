<script lang="ts">
  export let as = 'div';
</script>

<svelte:element this={as} class="flex gap-0.5">
  <span
    class="inline-flex w-1 h-1 rounded-full bg-white animate-pulse animation-delay-500"
  />
  <span
    class="inline-flex w-1 h-1 rounded-full bg-white animate-pulse animation-delay-300"
  />
  <span class="inline-flex w-1 h-1 rounded-full bg-white animate-pulse" />
</svelte:element>
