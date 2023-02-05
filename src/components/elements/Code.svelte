<script lang="ts">
  import Highlight from 'svelte-highlight/HighlightAuto.svelte';
  import 'svelte-highlight/styles/chalk.css';
  import './Code.css';

  export let text: string;
</script>

<Highlight code={text} />
