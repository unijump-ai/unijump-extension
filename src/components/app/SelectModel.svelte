<script lang="ts">
  import IconArrowLeft from '$assets/icons/arrow-left.svg?component';
  import { Button } from '$components/elements';
  import Menu from '$components/elements/Menu.svelte';
  import { appManager } from '$lib/app';

  export let disabled = false;

  const { store: appStore } = appManager;
  let isMenuOpen = false;

  $: items = $appStore.models.map((model) => ({
    label: model.title,
    onClick() {
      appManager.selectModel(model);
    },
  }));
</script>

{#if $appStore.models.length && $appStore.selectedModel}
  <Menu
    bind:open={isMenuOpen}
    name="chatgpt-models"
    {items}
    activeItemLabel={$appStore.selectedModel.title}
    style="modal"
  >
    <Button
      size="sm"
      {disabled}
      on:click={(evt) => {
        evt.stopPropagation();
        isMenuOpen = !isMenuOpen;
      }}
    >
      <span>
        {$appStore.selectedModel.title}
      </span>
      <span class="-rotate-90 ml-2 text-zinc-300">
        <IconArrowLeft width={14} height={14} />
      </span>
    </Button>
  </Menu>
{/if}
