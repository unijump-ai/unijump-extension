<script lang="ts">
  import IconCopy from '$assets/icons/copy.svg?component';
  import IconEdit from '$assets/icons/edit.svg?component';
  import IconExpand from '$assets/icons/expand.svg?component';
  import IconRefresh from '$assets/icons/refresh.svg?component';
  import IconShorten from '$assets/icons/shorten.svg?component';
  import Button from '$components/elements/Button.svelte';
  import { OutputAction } from '$lib/prompt/output.constants';
  import { pageAction } from '$lib/store';
  import { sleep } from '$lib/utils';
  import { createEventDispatcher } from 'svelte';

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
  {#if $pageAction?.input?.element}
    <Button class="col-span-2" on:click={() => dispatchAction(OutputAction.INJECT)}>
      <IconEdit width={16} />
      Paste to {$pageAction.input.name}
    </Button>
  {/if}
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
