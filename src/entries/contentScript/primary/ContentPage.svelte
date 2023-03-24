<script lang="ts">
  import App from '$components/app/App.svelte';
  import Draggable, {
    type DraggablePosition,
  } from '$components/elements/Draggable.svelte';
  import { closeModals, Modal } from '$components/modal';
  import FloatingWidget from '$components/widget/FloatingWidget.svelte';
  import { floatingWidgetPositionStorage } from '$components/widget/floatingWidgetStorage';
  import { appManager } from '$lib/app';
  import { OpenAppSource } from '$lib/extension/events/event.constants';
  import { listenMessage, sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { registerShortcut, ShortcutName } from '$lib/keyboard';
  import { appModalVisible, options } from '$lib/store';
  import { onMount } from 'svelte';
  import '../../../app.css';

  let appMounted = false;
  let draggablePosition: DraggablePosition = null;
  let toggleShortcut = '';
  let isWindowFullscreen = false;

  onMount(async () => {
    draggablePosition = (await floatingWidgetPositionStorage.get()) || {
      top: 80,
      right: 6,
    };

    const { response } = await sendMessage(Message.GET_TOGGLE_SHORTCUT, undefined);

    if (response) {
      toggleShortcut = response;
    }

    registerShortcut(ShortcutName.CloseModal, {
      display: 'esc',
      listen: true,
      keyOptions: {
        key: 'Escape',
        onEvent(evt: KeyboardEvent) {
          evt.preventDefault();
          evt.stopPropagation();
          closeModals();
        },
      },
    });

    listenMessage(Message.OPEN_MODAL, async () => {
      appManager.openModal();

      return {
        response: true,
      };
    });

    listenMessage(Message.TOGGLE_MODAL, async () => {
      appManager.toggleModal();

      return {
        response: $appModalVisible,
      };
    });

    document.addEventListener('fullscreenchange', () => {
      isWindowFullscreen = !!document.fullscreenElement;
    });

    setTimeout(() => {
      appMounted = true;
    }, 1000);
  });

  function onSetShortcut(evt: CustomEvent<string>) {
    const shortcut = evt.detail;

    if (!shortcut) return;

    toggleShortcut = shortcut;
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
      shortcut={toggleShortcut}
      direction={!!draggablePosition.left ? 'right' : 'left'}
      expanded={hovered || dragging}
      visible={!$appModalVisible && !isWindowFullscreen}
      on:activate={() => appManager.openModal(OpenAppSource.FLOATING_WIDGET)}
      on:set-shortcut={onSetShortcut}
    />
  </Draggable>
{/if}
<Modal
  id="unijump-modal"
  active={$appModalVisible}
  on:close={() => appManager.closeModal()}
  mount={appMounted}
>
  <div
    class="h-full w-full max-h-[800px] max-w-5xl mx-auto"
    bind:this={appManager.wrapperEl}
  >
    <App on:close={() => appManager.closeModal()} />
  </div>
</Modal>
