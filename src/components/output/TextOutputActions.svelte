<script lang="ts">
  import { OutputAction } from '$lib/prompt/output.constants';
  import { createEventDispatcher } from 'svelte';
  import { sleep } from '$lib/utils';
  import IconCopy from '$assets/icons/copy.svg?component';
  import IconRefresh from '$assets/icons/refresh.svg?component';
  import IconShorten from '$assets/icons/shorten.svg?component';
  import IconExpand from '$assets/icons/expand.svg?component';
  import Button from '$components/elements/Button.svelte';

  export let output: string;

  const dispatch = createEventDispatcher();

  let copied = false;

  async function copyOutputToClipboard() {
    if (copied) return;

    navigator.clipboard.writeText(output);
    copied = true;
    await sleep(2000);
    copied = false;
  }

  function dispatchAction(action: OutputAction) {
    dispatch('action', action);
  }
</script>

<div class="grid grid-cols-2 gap-2">
  <Button on:click={copyOutputToClipboard}>
    <IconCopy width={16} />
    {copied ? 'Copied!' : 'Copy'}
  </Button>
  <Button on:click={() => dispatchAction(OutputAction.REWRITE)}>
    <IconRefresh width={16} /> Rewrite
  </Button>
  <Button on:click={() => dispatchAction(OutputAction.SHORTEN)}>
    <IconShorten width={16} /> Shorten
  </Button>
  <Button on:click={() => dispatchAction(OutputAction.EXPAND)}>
    <IconExpand width={16} /> Expand
  </Button>
</div>
