<script lang="ts">
  import { toolboxActions } from '$lib/toolbox/toolbox.actions';
  import ToolboxAction from './ToolboxAction.svelte';
</script>

<ul class="flex gap-2">
  {#each toolboxActions as toolboxAction (toolboxAction.label)}
    <li class="flex items-center rounded-md">
      <ToolboxAction actionConfig={toolboxAction} />
    </li>
  {/each}
</ul>
