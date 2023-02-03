<script lang="ts">
  import Highlight from 'svelte-highlight/HighlightAuto.svelte';
  import 'svelte-highlight/styles/chalk.css';

  export let text: string;
</script>

<Highlight code={text} />

<style lang="postcss">
  :global(code.hljs) {
    @apply rounded-md my-2 text-xs leading-5;
  }
</style>
