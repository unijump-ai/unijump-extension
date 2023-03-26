<script lang="ts">
  import { AppContext } from '$lib/context';
  import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
  import { setContext } from 'svelte';
  import Toolbox from './Toolbox.svelte';

  export let inputEl: HTMLElement;

  const toolboxConfig: Partial<ToolboxWebsiteConfig> = {
    style: 'rounded',
  };

  setContext(AppContext.ToolboxConfig, toolboxConfig);
  setContext(AppContext.ToolboxInput, inputEl);
</script>

<Toolbox />
