<script lang="ts" context="module">
  interface ToolboxMenuItem {
    label: string;
    icon: typeof SvelteComponent;
    onClick?: (evt: MouseEvent) => void;
    link?: string;
  }
</script>

<script lang="ts">
  import IconDots from '$assets/icons/dots.svg?component';
  import IconEyeSlash from '$assets/icons/eye-slash.svg?component';
  import IconIdea from '$assets/icons/idea.svg?component';
  import IconOptions from '$assets/icons/options-outline.svg?component';
  import IconButton from '$components/elements/IconButton.svelte';
  import { clickOutside } from '$lib/actions';
  import { AppContext } from '$lib/context';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
  import { inlineClass } from '$lib/utils';
  import { createEventDispatcher, getContext, SvelteComponent } from 'svelte';

  const dispatch = createEventDispatcher();
  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;
  const items: ToolboxMenuItem[] = [
    {
      label: 'Suggest New Idea',
      icon: IconIdea,
      link: 'mailto:contact@unijump.ai&subject=New Idea for UniJump',
    },
    {
      label: 'Hide UniJumpBar',
      icon: IconEyeSlash,
      onClick() {
        dispatch('hide');
      },
    },
    {
      label: 'UniJump Options',
      icon: IconOptions,
      onClick() {
        sendMessage(Message.OPEN_OPTIONS_PAGE, undefined);
      },
    },
  ];

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function onItemClick(item: ToolboxMenuItem, evt: MouseEvent) {
    toggleMenu();

    if (item.link) {
      window.open(item.link, '_blank');
      return;
    }

    item.onClick?.(evt);
  }
</script>

<div class="toolbox-menu relative">
  <IconButton
    class="toolbox-menu-button"
    label="Toolbox Options"
    flat={toolboxConfig.style !== 'rounded'}
    on:click={(evt) => {
      evt.stopPropagation();
      toggleMenu();
    }}
  >
    <IconDots width={16} />
  </IconButton>
  {#if isMenuOpen}
    <div
      class={inlineClass('toolbox-menu-pop absolute right-0 z-10', [
        toolboxConfig.position === 'top' ? 'top-full pt-1' : 'bottom-full pb-1',
      ])}
      use:clickOutside={'.toolbox-menu'}
      on:clickoutside={() => toggleMenu()}
    >
      <ul
        class="min-w-[186px] p-2 bg-slate-800 text-zinc-300 border border-white/20 rounded-xl shadow-lg"
      >
        {#each items as item (item.label)}
          <li class="w-full">
            <button
              class="flex w-full items-center text-xs font-medium p-2.5 rounded-lg hover:bg-white/8 hover:text-white focus:bg-white/8 focus:text-white transition-all"
              on:click|stopPropagation={(evt) => onItemClick(item, evt)}
            >
              <svelte:component this={item.icon} width={16} />
              <span class="ml-2.5">{item.label}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  :global(.toolbox-menu-button:active) {
    background: radial-gradient(
        62.5% 62.5% at 50% 0%,
        rgba(255, 255, 255, 0.32) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      rgba(255, 255, 255, 0.16);
  }
</style>
