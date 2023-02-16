<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import unitextLogo from '$assets/logo.png?w=36;72&format=webp;png&picture';
  import { bindKeyPress } from '$lib/a11y';
  import { getShortcut } from '$lib/shortcuts';
  import { inlineClass } from '$lib/utils';
  import Picture from '$components/elements/Picture.svelte';
  import IconClose from '$assets/icons/close.svg?component';
  import ModalDialog from '$components/modal/ModalDialog.svelte';
  import Modal from '$components/modal/Modal.svelte';
  import ModalTitle from '$components/modal/ModalTitle.svelte';
  import ModalDescription from '$components/modal/ModalDescription.svelte';
  import Button from '$components/elements/Button.svelte';

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

  function hideWidget(host: string) {
    dispatch('hide', host);
  }
</script>

<div
  class={inlineClass('group relative transition-all', [
    visible ? 'opacity-100 visible' : 'opacity-0 invisible',
  ])}
>
  <button
    class={inlineClass(
      'absolute p-1 text-zinc-400 -right-3.5 -top-3.5 opacity-0 invisible transition-opacity delay-75',
      ['group-hover:opacity-100 group-hover:visible group-hover:delay-700']
    )}
    on:click={() => (isCloseModalActive = true)}
  >
    <IconClose width={16} />
  </button>
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
    on:keypress={bindKeyPress(['Enter'], () => dispatch('activate'))}
  >
    <div
      class={inlineClass('icon absolute top-1 pointer-events-none', [
        direction === 'left' ? 'right-1' : 'left-1',
      ])}
    >
      <Picture image={unitextLogo} width={36} alt="Unitext icon" />
    </div>
    <div
      class={inlineClass('text-sm font-medium uppercase', [
        expand ? 'text-white w-auto' : 'text-transparent absolute w-0',
      ])}
    >
      {getShortcut('app')}
    </div>
  </div>
</div>

<Modal bind:active={isCloseModalActive} id="floating-close">
  <ModalDialog>
    <ModalTitle>Hide Unitext widget</ModalTitle>
    <ModalDescription
      >You're about to hide Unitext widget. You can still open it with <code
        class="uppercase bg-white/10 border border-white/8 text-xs px-1 py-0.5 rounded-md font-sans tracking-[3px]"
        >{getShortcut('app')}</code
      > shortcut or by clicking on the Unitext icon in the browser toolbar.</ModalDescription
    >
    <div class="grid grid-cols-2 gap-2 mt-6">
      <Button on:click={() => hideWidget(window.location.host)}
        >Hide for this website</Button
      >
      <Button clean on:click={() => hideWidget('*')}>Hide for all websites</Button>
    </div>
  </ModalDialog>
</Modal>
