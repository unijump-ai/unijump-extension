<script lang="ts">
  import IconClose from '$assets/icons/close.svg?component';
  import IconDraggerHandle from '$assets/icons/dragger-handle.svg?component';
  import unijumpLogo from '$assets/logo.png?w=36;72&format=webp;png&picture';
  import Picture from '$components/elements/Picture.svelte';
  import { bindKeyEvent } from '$lib/keyboard';
  import { inlineClass } from '$lib/utils';
  import { ExclamationCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { createEventDispatcher, onMount } from 'svelte';
  import CloseModal from './CloseModal.svelte';
  import ShortcutModal from './ShortcutModal.svelte';

  export let direction: 'left' | 'right';
  export let expanded = false;
  export let visible = true;
  export let shortcut = '';
  export let disableClose = false;

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
    visible ? 'visible opacity-100' : 'invisible opacity-0',
  ])}
>
  <div
    class={inlineClass(
      'relative min-h-[44px] min-w-[44px] cursor-pointer rounded-full from-darkPurple-700 to-darkPurple-900 p-3 text-sm font-medium text-white outline-none transition-all hover:bg-gradient-radial-to-b',
      [
        expand
          ? `bg-darkPurple-900 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-darkPurple-900 ${
              direction === 'left' ? 'pr-12' : 'pl-12'
            }`
          : 'bg-transparent',
      ]
    )}
    style="--radial-size: 100% 100%;"
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
      class={inlineClass('icon pointer-events-none absolute top-1', [
        direction === 'left' ? 'right-1' : 'left-1',
      ])}
    >
      <Picture image={unijumpLogo} width={36} alt="UniJump icon" />
    </div>
    <div
      class={inlineClass('flex items-center text-sm font-medium uppercase', {
        'w-auto text-white': expand,
        'absolute w-0 text-transparent': !expand,
      })}
    >
      {#if shortcut}
        {shortcut}
      {:else if expand}
        <button
          class="text-amber-400 hover:text-amber-300"
          on:click|preventDefault|stopPropagation={() => (isShortcutModalActive = true)}
        >
          <Icon src={ExclamationCircle} width={20} />
        </button>
      {/if}
    </div>
  </div>
  {#if !disableClose}
    <button
      class={inlineClass(
        'group/close invisible absolute left-1/2 bottom-full -z-10 -translate-x-1/2 translate-y-1/2 -rotate-180 text-zinc-100 opacity-0 transition-none',
        [
          'group-hover/floating:visible group-hover/floating:translate-y-0 group-hover/floating:opacity-100 group-hover/floating:transition-all group-hover/floating:delay-[700ms]',
        ]
      )}
      on:click={() => (isCloseModalActive = true)}
    >
      <IconDraggerHandle width={44} height={17} />
      <span
        class={inlineClass(
          'absolute top-0 left-1/2 -translate-x-1/2 text-zinc-500 group-hover/close:text-zinc-700',
          []
        )}
      >
        <IconClose width={16} />
      </span>
      <span class="sr-only">Close widget</span>
    </button>
  {/if}
</div>

<CloseModal bind:active={isCloseModalActive} {shortcut} />
<ShortcutModal bind:active={isShortcutModalActive} on:set-shortcut={onSetShortcut} />
