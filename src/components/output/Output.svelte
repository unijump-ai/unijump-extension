<script lang="ts">
  import Markdown from '$components/elements/Markdown.svelte';
  import { ArrowPath } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let type: 'markdown' | 'text';
  export let output: string;
  export let loading: boolean;

  function trimQuotes(text?: string) {
    if (!text) return text;

    return text.replace(/(^"|"$)/g, '');
  }
</script>

<div>
  <h3 class="text-sm mb-4">Output</h3>
  <div
    class="block w-full text-white px-4 py-3 text-sm font-medium bg-white/8 border border-white/10 rounded-md"
  >
    {#if output}
      {#if type === 'markdown'}
        <Markdown source={output} />
      {:else}
        <p>{trimQuotes(output)}</p>
      {/if}
    {:else if loading}
      <p class="flex justify-center m-0">
        <Icon class="animate-spin w-6 h-6" src={ArrowPath} />
      </p>
    {:else}
      <span class="text-white/50">Waiting for output...</span>
    {/if}
  </div>
</div>
