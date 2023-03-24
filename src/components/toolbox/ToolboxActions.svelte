<script lang="ts">
  import { AppContext } from '$lib/context';
  import { toolboxActions } from '$lib/toolbox/toolbox.actions';
  import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
  import { getContext } from 'svelte';
  import ToolboxAction from './ToolboxAction.svelte';

  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;
  const actions = toolboxActions.map((createToolboxAction) =>
    createToolboxAction(toolboxConfig)
  );
</script>

<ul class="flex gap-2">
  {#each actions as toolboxAction (toolboxAction.label)}
    <li class="flex items-center rounded-md">
      <ToolboxAction actionConfig={toolboxAction} />
    </li>
  {/each}
</ul>
