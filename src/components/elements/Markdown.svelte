<script lang="ts">
  import SvelteMarkdown from '@dogagenc/svelte-markdown';
  import Code from './Code.svelte';

  export let source: string = '';

  const renderers = {
    code: Code,
  };

  $: transformedSource = transformSource(source);

  function transformSource(source: string) {
    return matchBackticks(source);
  }

  function matchBackticks(source: string) {
    const backTicksLength = (source.match(/\`\`\`/g) || []).length;

    if (backTicksLength % 2 !== 0) {
      return `${source}\n\`\`\``;
    }

    return source;
  }
</script>

<div class="marked-own w-full">
  <SvelteMarkdown source={transformedSource} {renderers} options={{ mangle: false }} />
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
  .marked-own h2 {
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
  .marked-own ol {
    @apply pl-4;
  }

  .marked-own ul {
    @apply list-disc;
  }

  .marked-own ol {
    @apply list-decimal;
  }

  .marked-own table {
    @apply w-full table-auto border-collapse rounded-md border border-white/20;
  }

  .marked-own th,
  .marked-own td {
    @apply border border-white/20;
  }

  .marked-own code:not(.hljs) {
    @apply rounded-md border border-white/10 bg-white/10 px-1 text-xs font-semibold;
  }
</style>
