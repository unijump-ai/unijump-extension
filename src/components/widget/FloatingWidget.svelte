<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import unijumpLogo from '$assets/logo.png?w=36;72&format=webp;png&picture';
  import { bindKeyEvent, getShortcut, ShortcutName } from '$lib/keyboard';
  import { inlineClass } from '$lib/utils';
  import Picture from '$components/elements/Picture.svelte';
  import IconClose from '$assets/icons/close.svg?component';
  import IconDraggerHandle from '$assets/icons/dragger-handle.svg?component';
  import ModalDialog from '$components/modal/ModalDialog.svelte';
  import Modal from '$components/modal/Modal.svelte';
  import ModalTitle from '$components/modal/ModalTitle.svelte';
  import ModalDescription from '$components/modal/ModalDescription.svelte';
  import Button from '$components/elements/Button.svelte';
  import { options } from '$lib/store';

  export let direction: 'left' | 'right';
  export let expanded = false;
  export let visible = true;

  const dispatch = createEventDispatcher();

  let hasSelection = false;
  let isCloseModalActive = false;

  $: expand = hasSelection || expanded;

  onMount(() => {
    const onSelectionChange = () => {
      const selection = document.getSelection().toString();

      hasSelection = !!selection.length;
    };

    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  });
</script>

<div
  class={inlineClass('group/floating relative transition-all', [
    visible ? 'opacity-100 visible' : 'opacity-0 invisible',
  ])}
>
  <div
    class={inlineClass(
      'relative p-3 text-white font-medium text-sm rounded-full cursor-pointer min-w-[44px] min-h-[44px] transition-all outline-none',
      [
        expand
          ? `bg-darkPurple-800 ${direction === 'left' ? 'pr-12' : 'pl-12'}`
          : 'bg-transparent',
      ]
    )}
    role="button"
    tabindex="0"
    on:focus={() => (expanded = true)}
    on:blur={() => (expanded = false)}
    on:click={() => dispatch('activate')}
    on:keypress={bindKeyEvent(
      { key: 'Enter', onEvent: () => dispatch('activate') },
      { key: ' ', onEvent: () => dispatch('activate') }
    )}
  >
    <div
      class={inlineClass('icon absolute top-1 pointer-events-none', [
        direction === 'left' ? 'right-1' : 'left-1',
      ])}
    >
      <Picture image={unijumpLogo} width={36} alt="UniJump icon" />
    </div>
    <div
      class={inlineClass('text-sm font-medium uppercase', [
        expand ? 'text-white w-auto' : 'text-transparent absolute w-0',
      ])}
    >
      {getShortcut(ShortcutName.ToggleModal).display}
    </div>
  </div>
  <button
    class={inlineClass(
      'group/close absolute text-zinc-100 left-1/2 -translate-x-1/2 translate-y-1/2 -rotate-180 bottom-full opacity-0 invisible transition-none -z-10',
      [
        'group-hover/floating:translate-y-0 group-hover/floating:opacity-100 group-hover/floating:visible group-hover/floating:transition-all group-hover/floating:delay-[700ms]',
      ]
    )}
    on:click={() => (isCloseModalActive = true)}
  >
    <IconDraggerHandle />
    <span
      class={inlineClass(
        'absolute text-zinc-500 top-0 left-1/2 -translate-x-1/2 group-hover/close:text-zinc-700',
        []
      )}
    >
      <IconClose width={16} />
    </span>
    <span class="sr-only">Close widget</span>
  </button>
</div>

<Modal bind:active={isCloseModalActive} id="floating-close">
  <ModalDialog>
    <ModalTitle>Hide UniJump widget</ModalTitle>
    <ModalDescription
      >You're about to hide UniJump widget. You can still open it with <code
        class="uppercase bg-white/10 border border-white/8 text-xs px-1 py-0.5 rounded-md font-sans tracking-[3px]"
        >{getShortcut(ShortcutName.ToggleModal).display}</code
      > shortcut or by clicking on the UniJump icon in the browser toolbar.</ModalDescription
    >
    <div class="grid grid-cols-2 gap-2 mt-6">
      <Button on:click={() => options.toggleWidgetHost(window.location.host)}
        >Hide for this website</Button
      >
      <Button clean on:click={() => options.updateWidgetDisabled(true)}
        >Hide for all websites</Button
      >
    </div>
  </ModalDialog>
</Modal>
