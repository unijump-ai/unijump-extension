<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import Code from './Code.svelte';

  export let source: string = '';

  const renderers = {
    code: Code,
  };
</script>

<div class="marked-own text-sm font-medium w-full">
  <SvelteMarkdown {source} {renderers} />
</div>

<style lang="postcss" global>
  .marked-own h1,
  .marked-own h2,
  .marked-own h3,
  .marked-own h4,
  .marked-own h5,
  .marked-own h6,
  .marked-own p,
  .marked-own ul,
  .marked-own ol,
  .marked-own table {
    @apply mb-4;
  }

  .marked-own p:only-child {
    @apply mb-0;
  }

  .marked-own li {
    @apply mt-2 mb-4;
  }

  .marked-own h1,
  h2 {
    @apply text-2xl;
  }

  .marked-own h3 {
    @apply text-xl;
  }

  .marked-own h4 {
    @apply text-lg;
  }

  .marked-own h5 {
    @apply text-base;
  }

  .marked-own h6 {
    @apply text-sm;
  }

  .marked-own ul,
  ol {
    @apply pl-4;
  }

  .marked-own ul {
    @apply list-disc;
  }

  .marked-own ol {
    @apply list-decimal;
  }

  .marked-own table {
    @apply border border-white/20 border-collapse w-full table-auto rounded-md;
  }

  .marked-own th,
  td {
    @apply border border-white/20;
  }

  .marked-own code:not(.hljs) {
    @apply bg-white/10 border border-white/10 px-1 rounded-md text-xs font-semibold;
  }
</style>
