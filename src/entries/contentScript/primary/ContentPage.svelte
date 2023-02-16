<script lang="ts">
  import '../../../app.css';
  import { onMount } from 'svelte';
  import { listenMessage } from '$lib/extension/messaging';
  import { errorStore, selectedText } from '$lib/store';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { getShortcut, registerShortcut } from '$lib/shortcuts';
  import { floatingWidgetPositionStorage } from '$components/widget/floatingWidgetStorage';
  import { options } from '$lib/store';
  import Modal, { closeModals } from '$components/modal/Modal.svelte';
  import App from '$components/app/App.svelte';
  import Draggable, {
    type DraggablePosition,
  } from '$components/elements/Draggable.svelte';
  import FloatingWidget from '$components/widget/FloatingWidget.svelte';

  let appModalVisible = false;
  let appWrapperEl: HTMLDivElement;
  let draggablePosition: DraggablePosition = null;

  onMount(async () => {
    draggablePosition = (await floatingWidgetPositionStorage.get()) || {
      top: 80,
      right: 16,
    };

    registerShortcut(getShortcut('app'), (evt) => {
      evt.preventDefault();

      toggleModal();
    });

    registerShortcut('Esc', () => {
      closeModals();
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
</script>

{#if draggablePosition && $options && !$options.widgetDisabled && !$options.disabledWidgetHosts.includes(window.location.host)}
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
    />
  </Draggable>
{/if}
<Modal id="unitext-modal" active={appModalVisible} on:close={closeModal}>
  <div class="h-full w-full max-h-[800px] max-w-5xl mx-auto" bind:this={appWrapperEl}>
    {#if appModalVisible}
      <App on:close={closeModal} />
    {/if}
  </div>
</Modal>
