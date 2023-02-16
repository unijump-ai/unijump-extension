<script lang="ts">
  import '../../../app.css';
  import { onMount } from 'svelte';
  import { listenMessage } from '$lib/extension/messaging';
  import { errorStore, selectedText } from '$lib/store';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { getShortcut, registerShortcut } from '$lib/shortcuts';
  import { ExtensionStorage } from '$lib/extension/storage';
  import Modal from '$components/modal/Modal.svelte';
  import App from '$components/app/App.svelte';
  import Draggable, {
    type DraggablePosition,
  } from '$components/elements/Draggable.svelte';
  import FloatingWidget from '$components/widget/FloatingWidget.svelte';
  // TODO: Test for context module
  // import IconButton from '$components/elements/IconButton.svelte';
  // import IconCopy from '$assets/icons/copy.svg?component';

  const floatingWidgetPositionStorage = new ExtensionStorage<DraggablePosition>(
    'floating-widget-position'
  );
  const floatingWidgetDisabledHostsStorage = new ExtensionStorage<string[]>(
    'floating-widget-disabled-hosts'
  );

  let appModalVisible = false;
  let appWrapperEl: HTMLDivElement;
  let floatingDisabledHosts: string[] = [];
  let draggablePosition: DraggablePosition = null;

  $: floatingWidgetDisabled = ['*', window.location.host].some((host) =>
    floatingDisabledHosts.includes(host)
  );

  onMount(async () => {
    floatingDisabledHosts = (await floatingWidgetDisabledHostsStorage.get()) || [];
    draggablePosition = (await floatingWidgetPositionStorage.get()) || {
      top: 80,
      right: 16,
    };

    registerShortcut(getShortcut('app'), (evt) => {
      evt.preventDefault();

      toggleModal();
    });

    listenMessage(Message.OPEN_MODAL, () => {
      openModal();
    });

    listenMessage(Message.TOGGLE_MODAL, () => {
      toggleModal();
    });
  });

  function openModal() {
    const selection = window.getSelection().toString();
    selectedText.set(selection || '');
    appModalVisible = true;
    appWrapperEl?.focus();
  }

  function closeModal() {
    appModalVisible = false;
    errorStore.set(null);
  }

  function toggleModal() {
    if (appModalVisible) {
      closeModal();
      return;
    }

    openModal();
  }

  async function hideWidget(evt: CustomEvent<string>) {
    const host = evt.detail;

    floatingDisabledHosts = [...floatingDisabledHosts, host];

    await floatingWidgetDisabledHostsStorage.set(floatingDisabledHosts);
  }
</script>

{#if draggablePosition && !floatingWidgetDisabled}
  <Draggable
    bind:position={draggablePosition}
    showHandle={false}
    handlePosition="bottom"
    on:dragend={() => floatingWidgetPositionStorage.set(draggablePosition)}
    let:hovered
  >
    <FloatingWidget
      direction={!!draggablePosition.left ? 'right' : 'left'}
      expanded={hovered}
      visible={!appModalVisible}
      on:activate={openModal}
      on:hide={hideWidget}
    />
  </Draggable>
{/if}
<!-- TODO: Test for context module? -->
<!-- <Draggable position={{ left: 16, top: 16 }} showHandle={true}>
  <IconButton label="Hi">
    <IconCopy />
  </IconButton>
</Draggable> -->
<Modal id="unitext-modal" active={appModalVisible} on:close={closeModal}>
  <div class="h-full w-full max-w-5xl mx-auto" bind:this={appWrapperEl}>
    {#if appModalVisible}
      <App on:close={closeModal} />
    {/if}
  </div>
</Modal>
