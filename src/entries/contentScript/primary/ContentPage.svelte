<script lang="ts">
  import '../../../app.css';
  import { onMount } from 'svelte';
  import { listenMessage, sendMessage } from '$lib/extension/messaging';
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
  import { APP_OPEN_SOURCE, UserEvent } from '$lib/extension/events/event.constants';

  let appModalVisible = false;
  let appWrapperEl: HTMLDivElement;
  let draggablePosition: DraggablePosition = null;

  onMount(async () => {
    draggablePosition = (await floatingWidgetPositionStorage.get()) || {
      top: 80,
      right: 6,
    };

    registerShortcut(getShortcut('app'), (evt) => {
      evt.preventDefault();

      openModal(APP_OPEN_SOURCE.SHORTCUT);
    });

    registerShortcut('Esc', () => {
      closeModals();
    });

    listenMessage(Message.OPEN_MODAL, async () => {
      openModal();

      return {
        message: true,
      };
    });
  });

  function openModal(source?: APP_OPEN_SOURCE) {
    const selection = window.getSelection().toString();
    selectedText.set(selection || '');
    appModalVisible = true;
    appWrapperEl?.focus();

    if (source) {
      sendMessage(Message.SEND_EVENT, { type: UserEvent.APP_OPEN, props: { source } });
    }
  }

  function closeModal() {
    appModalVisible = false;
    errorStore.set(null);
  }
</script>

{#if draggablePosition && $options && !$options.widgetDisabled && !$options.disabledWidgetHosts.includes(window.location.host)}
  <Draggable
    bind:position={draggablePosition}
    showHandle={false}
    handlePosition="bottom"
    paddingX={6}
    paddingY={16}
    on:dragend={() => floatingWidgetPositionStorage.set(draggablePosition)}
    let:hovered
    let:dragging
  >
    <FloatingWidget
      direction={!!draggablePosition.left ? 'right' : 'left'}
      expanded={hovered || dragging}
      visible={!appModalVisible}
      on:activate={() => openModal(APP_OPEN_SOURCE.FLOATING_WIDGET)}
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
