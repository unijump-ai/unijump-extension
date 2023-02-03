<script lang="ts">
  import { ArrowPath } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let output: string;
  export let loading: boolean;
</script>

<div>
  <h3 class="text-sm mb-4">Output</h3>
  <p
    class="block w-full text-white px-4 py-3 text-sm bg-white/8 border border-white/10 rounded-md"
  >
    {#if output}
      {output}
    {:else if loading}
      <p class="flex justify-center">
        <Icon class="animate-spin w-6 h-6" src={ArrowPath} />
      </p>
    {:else}
      <span class="text-white/50">Waiting for output...</span>
    {/if}
  </p>
</div>
