<script lang="ts">
  import type { ApiSession } from '$lib/api';
  import '../../../app.css';
  import { onMount } from 'svelte';
  import { listenMessage, sendMessage } from '$lib/extension/messaging';
  import { activePage, errorStore, selectedText, user } from '$lib/store';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { registerShortcut, ShortcutName } from '$lib/keyboard';
  import { floatingWidgetPositionStorage } from '$components/widget/floatingWidgetStorage';
  import { options } from '$lib/store';
  import { closeModals, Modal } from '$components/modal';
  import App from '$components/app/App.svelte';
  import Draggable, {
    type DraggablePosition,
  } from '$components/elements/Draggable.svelte';
  import FloatingWidget from '$components/widget/FloatingWidget.svelte';
  import { OpenAppSource, UserEvent } from '$lib/extension/events/event.constants';
  import { PageName } from '$lib/navigation';

  let appMounted = false;
  let appModalVisible = false;
  let appWrapperEl: HTMLDivElement;
  let draggablePosition: DraggablePosition = null;
  let toggleShortcut = '';
  let isWindowFullscreen = false;

  onMount(async () => {
    draggablePosition = (await floatingWidgetPositionStorage.get()) || {
      top: 80,
      right: 6,
    };

    const { message } = await sendMessage(Message.GET_TOGGLE_SHORTCUT, undefined);

    if (message) {
      toggleShortcut = message;
    }

    registerShortcut(ShortcutName.CloseModal, {
      display: 'esc',
      listen: true,
      keyOptions: {
        key: 'Escape',
        onEvent() {
          closeModals();
        },
      },
    });

    listenMessage(Message.OPEN_MODAL, async () => {
      openModal();

      return {
        message: true,
      };
    });

    listenMessage(Message.TOGGLE_MODAL, async () => {
      toggleModal();

      return {
        message: appModalVisible,
      };
    });

    document.addEventListener('fullscreenchange', () => {
      isWindowFullscreen = !!document.fullscreenElement;
    });

    setTimeout(() => {
      appMounted = true;
    }, 1000);
  });

  function openModal(source?: OpenAppSource) {
    const selection = window.getSelection().toString();
    selectedText.set(selection || '');

    if (selection) {
      activePage.set(PageName.Paraphraser);
    }

    appModalVisible = true;
    appWrapperEl?.focus();

    if (source) {
      sendMessage(Message.SEND_EVENT, {
        type: UserEvent.APP_OPEN,
        props: { 'opened-from': source },
      });
    }
    checkSession();
  }

  function closeModal() {
    appModalVisible = false;
    errorStore.set(null);
  }

  function toggleModal() {
    if (appModalVisible) {
      closeModal();
    } else {
      openModal();
    }
  }

  function onSetShortcut(evt: CustomEvent<string>) {
    const shortcut = evt.detail;

    if (!shortcut) return;

    toggleShortcut = shortcut;
  }

  async function checkSession() {
    const { message, error } = await sendMessage(Message.GET_SESSION, undefined);

    if (error) {
      errorStore.set(error);
      return;
    }

    const session = message as ApiSession;
    user.set(session.user);
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
      visible={!appModalVisible && !isWindowFullscreen}
      on:activate={() => openModal(OpenAppSource.FLOATING_WIDGET)}
      on:set-shortcut={onSetShortcut}
    />
  </Draggable>
{/if}
<Modal
  id="unijump-modal"
  active={appModalVisible}
  on:close={closeModal}
  mount={appMounted}
>
  <div class="h-full w-full max-h-[800px] max-w-5xl mx-auto" bind:this={appWrapperEl}>
    <App on:close={closeModal} />
  </div>
</Modal>
