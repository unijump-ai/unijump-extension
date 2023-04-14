<script lang="ts">
  import Markdown from '$components/elements/Markdown.svelte';
  import { autoHeight } from '$lib/actions';
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
  <h3 class="mb-4 text-sm">Output</h3>
  <div
    class="block w-full select-text rounded-md border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white"
  >
    {#if output}
      {#if type === 'markdown'}
        <Markdown source={output} />
      {:else}
        <textarea
          class="block h-5 w-full cursor-text resize-none bg-transparent"
          value={trimQuotes(output)}
          rows={1}
          use:autoHeight={{ watch: output, emptyHeight: 20 }}
          disabled
        />
      {/if}
    {:else if loading}
      <p class="m-0 flex justify-center">
        <Icon class="h-6 w-6 animate-spin" src={ArrowPath} />
      </p>
    {:else}
      <span class="text-white/50">Waiting for output...</span>
    {/if}
  </div>
</div>
