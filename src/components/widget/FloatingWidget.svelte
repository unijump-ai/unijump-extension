<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import unijumpLogo from '$assets/logo.png?w=36;72&format=webp;png&picture';
  import { bindKeyEvent } from '$lib/keyboard';
  import { inlineClass } from '$lib/utils';
  import Picture from '$components/elements/Picture.svelte';
  import IconClose from '$assets/icons/close.svg?component';
  import IconDraggerHandle from '$assets/icons/dragger-handle.svg?component';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ExclamationCircle } from '@steeze-ui/heroicons';
  import ShortcutModal from './ShortcutModal.svelte';
  import CloseModal from './CloseModal.svelte';

  export let direction: 'left' | 'right';
  export let expanded = false;
  export let visible = true;
  export let shortcut = '';

  const dispatch = createEventDispatcher();

  let hasSelection = false;
  let isCloseModalActive = false;
  let isShortcutModalActive = false;

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

  function onSetShortcut(evt: CustomEvent<string>) {
    const newShortcut = evt.detail;
    if (!shortcut && newShortcut) {
      expanded = true;
    }

    dispatch('set-shortcut', newShortcut);
  }
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
      class={inlineClass('text-sm flex items-center font-medium uppercase', {
        'w-auto text-white': expand,
        'absolute w-0 text-transparent': !expand,
      })}
    >
      {#if shortcut}
        {shortcut}
      {:else if expanded}
        <button
          class="text-amber-400 hover:text-amber-300"
          on:click|preventDefault|stopPropagation={() => (isShortcutModalActive = true)}
        >
          <Icon src={ExclamationCircle} width={20} />
        </button>
      {/if}
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

<CloseModal bind:active={isCloseModalActive} {shortcut} />
<ShortcutModal bind:active={isShortcutModalActive} on:set-shortcut={onSetShortcut} />
