<script lang="ts">
  import IconDots from '$assets/icons/dots.svg?component';
  import IconEyeSlash from '$assets/icons/eye-slash.svg?component';
  import IconIdea from '$assets/icons/idea.svg?component';
  import IconOptions from '$assets/icons/options-outline.svg?component';
  import IconButton from '$components/elements/IconButton.svelte';
  import Menu, { type MenuItem } from '$components/elements/menu/Menu.svelte';
  import { AppContext } from '$lib/context';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
  import { createEventDispatcher, getContext } from 'svelte';

  const dispatch = createEventDispatcher();
  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;
  const items: MenuItem[] = [
    {
      label: 'Suggest New Idea',
      icon: IconIdea,
      link: 'https://bit.ly/unijump-feedback',
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
</script>

<Menu
  bind:open={isMenuOpen}
  name="toolbox-menu"
  {items}
  position={toolboxConfig.position}
>
  <IconButton
    class="toolbox-menu-button"
    label="Toolbox Options"
    flat={toolboxConfig.style !== 'rounded'}
    on:click={(evt) => {
      evt.stopPropagation();
      isMenuOpen = !isMenuOpen;
    }}
  >
    <IconDots width={16} />
  </IconButton>
</Menu>

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
