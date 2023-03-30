<script lang="ts">
  import unijumpLogo from '$assets/logo.png?w=20;40&format=webp;png&picture';
  import Picture from '$components/elements/Picture.svelte';
  import { AppContext } from '$lib/context';
  import { appModalVisible, options } from '$lib/store';
  import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
  import { inlineClass } from '$lib/utils';
  import { getContext } from 'svelte';
  import HideModal from './HideModal.svelte';
  import ToolboxActions from './ToolboxActions.svelte';
  import ToolboxMenu from './ToolboxMenu.svelte';

  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;

  let isHideModalActive = false;

  $: isDisabled = $options?.disabledToolboxHosts?.includes(toolboxConfig.host);

  function openApp() {
    appModalVisible.set(true);
  }

  function hideToolbox() {
    isHideModalActive = true;
  }
</script>

<div
  class={inlineClass(
    'toolbox text-left w-full flex gap-3 items-center px-2 py-1 text-white font-sans antialiased',
    {
      '!visible !opacity-100 !static': !isDisabled,
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
  <ToolboxMenu on:hide={() => hideToolbox()} />
</div>
<HideModal
  bind:active={isHideModalActive}
  host={toolboxConfig.host}
  websiteName={toolboxConfig.name}
/>

<style>
  /* TODO: Add toolbox colors to tailwind */
  .toolbox {
    background: linear-gradient(270deg, #4d29b2 0%, #311fa3 100%);
  }
</style>
