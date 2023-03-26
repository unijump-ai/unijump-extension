<script lang="ts">
  import { AppContext } from '$lib/context';
  import { toolboxActions } from '$lib/toolbox/toolbox.actions';
  import { getContext } from 'svelte';
  import ToolboxAction from './ToolboxAction.svelte';

  const toolboxInput = getContext(AppContext.ToolboxInput) as HTMLElement;
  const actions = toolboxActions.map((createToolboxAction) =>
    createToolboxAction(toolboxInput)
  );
</script>

<ul class="flex gap-2">
  {#each actions as toolboxAction (toolboxAction.label)}
    <li class="flex items-center rounded-md">
      <ToolboxAction actionConfig={toolboxAction} />
    </li>
  {/each}
</ul>
