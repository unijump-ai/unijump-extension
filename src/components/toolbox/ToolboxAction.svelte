<script lang="ts">
  import IconArrowLeft from '$assets/icons/arrow-left.svg?component';
  import { AppContext } from '$lib/context';
  import { getInputValue } from '$lib/toolbox';
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

  const toolboxInput = getContext(AppContext.ToolboxInput) as HTMLElement;
  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;

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
    const inputValue = getInputValue(toolboxInput);
    const selectedText = window.getSelection().toString();
    const input = inputValue || selectedText;

    actionConfig.callback({ input, selected: item });
  }
</script>

<svelte:window on:focusin={onElementFocus} />
{#if actionConfig.type === ToolboxActionType.Button}
  <button class="toolbox-action" on:click={() => runAction()}>{actionConfig.label}</button
  >
{:else if actionConfig.type === ToolboxActionType.Menu}
  <button
    class="toolbox-action relative flex items-center"
    on:click|preventDefault={() => {}}
    on:mouseenter={() => openMenu()}
    on:mouseleave={() => closeMenu()}
    on:focus={() => openMenu()}
    bind:this={menuButtonEl}
    >{actionConfig.label}
    <span class={inlineClass('ml-1 -rotate-90')}><IconArrowLeft width={12} /></span>
    {#if isMenuOpen}
      <div
        class={inlineClass('absolute min-w-[167px] left-0 z-10 ', [
          toolboxConfig.position === 'top' ? 'top-full pt-1.5' : 'bottom-full pb-1.5',
        ])}
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
</style>
