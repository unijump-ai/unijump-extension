<script lang="ts">
  import IconClose from '$assets/icons/close.svg?component';
  import unijumpLogo from '$assets/logo.png?w=20;40&format=webp;png&picture';
  import IconButton from '$components/elements/IconButton.svelte';
  import Picture from '$components/elements/Picture.svelte';
  import { AppContext } from '$lib/context';
  import { appModalVisible } from '$lib/store';
  import { disableToolboxForHost } from '$lib/toolbox';
  import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
  import { inlineClass } from '$lib/utils';
  import { getContext } from 'svelte';
  import ToolboxActions from './ToolboxActions.svelte';

  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;

  let isClosed = false;

  function openApp() {
    appModalVisible.set(true);
  }

  function closeToolbox() {
    isClosed = true;
    disableToolboxForHost(toolboxConfig.host);
  }
</script>

<div
  class={inlineClass(
    'toolbox text-left w-full flex gap-3 items-center px-2 py-1 text-white font-sans antialiased transition-all duration-75 ',
    {
      '!visible !opacity-100 !static': !isClosed,
      'rounded-full': toolboxConfig.style === 'rounded',
    }
  )}
  style="visibility: hidden; opacity: 0; position: absolute; {toolboxConfig.toolboxStyles ||
    ''}"
>
  <button class="flex gap-1 items-center" on:click={openApp}>
    <Picture image={unijumpLogo} width={20} alt="Unijump logo" />
    <span class="font-bold text-sm">Unijump.ai</span>
  </button>
  <div class="flex-1">
    <ToolboxActions />
  </div>
  <IconButton
    label="Close toolbox"
    on:click={closeToolbox}
    flat={toolboxConfig.style === 'flat'}
  >
    <IconClose width={16} />
  </IconButton>
</div>

<style>
  .toolbox {
    background: linear-gradient(270deg, #4d29b2 0%, #311fa3 100%);
  }
</style>
