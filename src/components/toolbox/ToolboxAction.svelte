<script lang="ts">
  import IconArrowLeft from '$assets/icons/arrow-left.svg?component';
  import { AppContext } from '$lib/context';
  import { ToolboxActionType } from '$lib/toolbox/toolbox.constants';
  import type {
    ToolboxActionConfig,
    ToolboxActionMenuItem,
    ToolboxWebsiteConfig,
  } from '$lib/toolbox/toolbox.types';
  import { inlineClass } from '$lib/utils';
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  export let actionConfig: ToolboxActionConfig;

  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;
  const actionClasses =
    'toolbox-action text-zinc-50 px-2 py-1 rounded-md text-xs font-medium shadow-sm bg-gradient-to-b from-white/12 to-white/22 hover:bg-white/12 transition-all';

  let isMenuOpen = false;
  let menuListEl: HTMLDivElement;
  let menuButtonEl: HTMLButtonElement;

  function openMenu() {
    isMenuOpen = true;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  function onMenuItemClick(item: ToolboxActionMenuItem) {
    closeMenu();
    runAction(item);
  }

  function onElementFocus(evt: FocusEvent) {
    const focusedEl = evt.target as HTMLElement;

    if (!menuListEl || focusedEl === menuButtonEl) return;

    if (!menuListEl.contains(focusedEl)) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function runAction(item?: ToolboxActionMenuItem) {
    const inputValue = toolboxConfig.getValue();
    const selectedText = window.getSelection().toString();
    const input = inputValue || selectedText;

    actionConfig.callback({ input, selected: item });
  }
</script>

<svelte:window on:focusin={onElementFocus} />
{#if actionConfig.type === ToolboxActionType.Button}
  <button class={actionClasses} on:click={() => runAction()}>{actionConfig.label}</button>
{:else if actionConfig.type === ToolboxActionType.Menu}
  <button
    class="{actionClasses} relative flex items-center"
    on:click|preventDefault={() => {}}
    on:mouseenter={() => openMenu()}
    on:mouseleave={() => closeMenu()}
    on:focus={() => openMenu()}
    bind:this={menuButtonEl}
    >{actionConfig.label}
    <span class={inlineClass('ml-1 -rotate-90')}><IconArrowLeft width={12} /></span>
    {#if isMenuOpen}
      <div
        class="absolute min-w-[167px] left-0 z-10 bottom-full pb-1.5"
        transition:fade={{ duration: 50 }}
        bind:this={menuListEl}
      >
        <ul class="toolbox-menu p-1.5 rounded-lg">
          {#each actionConfig.items as item (item.value)}
            <li class="block w-full">
              <button
                class="block w-full p-2 rounded-lg text-sm text-zinc-300 font-medium text-left pointer-events-auto hover:bg-white/8 hover:text-white focus:bg-white/8 "
                on:click={() => onMenuItemClick(item)}>{item.label}</button
              >
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </button>
{/if}

<style>
  .toolbox-menu {
    position: relative;
    background: linear-gradient(160.85deg, #485ff5 0%, #491fad 87.11%);
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.2) inset,
      0px 4px 36px rgba(0, 0, 0, 0.5);
  }

  .toolbox-action {
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.1) inset,
      0px 1px 1px rgba(0, 0, 0, 0.12);
  }
</style>
