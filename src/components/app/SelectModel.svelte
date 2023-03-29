<script lang="ts">
  import IconArrowLeft from '$assets/icons/arrow-left.svg?component';
  import { Button } from '$components/elements';
  import Menu, { type MenuItem } from '$components/elements/menu/Menu.svelte';
  import { ModalDialog } from '$components/modal';
  import Modal from '$components/modal/Modal.svelte';
  import ModalDescription from '$components/modal/ModalDescription.svelte';
  import ModalTitle from '$components/modal/ModalTitle.svelte';
  import config from '$config';
  import type { ChatGPTModel } from '$lib/api';
  import { appManager } from '$lib/app';

  export let disabled = false;

  const { store: appStore } = appManager;
  let isMenuOpen = false;
  let isPlusModalOpen = false;
  let plusModelName = '';

  $: items = $appStore.models.map((model) => ({
    label: model.title,
    onClick() {
      if (model.isPaid && !$appStore.user.isPaid) {
        showPlusModal(model);
        return;
      }

      appManager.selectModel(model);
    },
  }));

  function getModel(item: MenuItem) {
    return $appStore.models.find((model) => model.title === item.label);
  }

  function isPaidModel(item: MenuItem) {
    return !!getModel(item).isPaid;
  }

  function showPlusModal(model: ChatGPTModel) {
    plusModelName = model.title;
    isPlusModalOpen = true;
  }
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
    <svelte:fragment slot="item-append" let:item>
      {#if isPaidModel(item)}
        <span
          class="text-[8px] ml-1 border border-amber-400 bg-amber-300 text-amber-900 font-bold rounded-[4px] px-1"
          >PLUS</span
        >
      {/if}
    </svelte:fragment>
  </Menu>
{/if}
<Modal bind:active={isPlusModalOpen} id="plus-modal">
  <ModalDialog>
    <ModalTitle>Upgrade ChatGPT plan</ModalTitle>
    <ModalDescription
      >In order to access the {plusModelName} model, it is necessary to sign up for the ChatGPT
      Plus plan. You can upgrade your plan by visiting the ChatGPT website.</ModalDescription
    >
    <div class="grid grid-cols-2 gap-2 mt-6">
      <Button on:click={() => window.open(config.chatGPT.chatUrl, '_blank')}
        >Visit ChatGPT website</Button
      >
      <Button clean on:click={() => (isPlusModalOpen = false)}>Cancel</Button>
    </div></ModalDialog
  >
</Modal>
