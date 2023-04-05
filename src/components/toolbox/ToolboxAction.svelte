<script lang="ts">
  import IconArrowLeft from '$assets/icons/arrow-left.svg?component';
  import { AppContext } from '$lib/context';
  import { UserEvent } from '$lib/extension/events/event.constants';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { getInputValue } from '$lib/toolbox';
  import { ToolboxActionType } from '$lib/toolbox/toolbox.constants';
  import type {
    ToolboxActionConfig,
    ToolboxActionMenuItem,
    ToolboxWebsiteConfig,
  } from '$lib/toolbox/toolbox.types';
  import { inlineClass, sleep } from '$lib/utils';
  import { getContext } from 'svelte';

  export let actionConfig: ToolboxActionConfig;

  const toolboxInput = getContext(AppContext.ToolboxInput) as HTMLElement;
  const toolboxConfig = getContext(AppContext.ToolboxConfig) as ToolboxWebsiteConfig;

  let hideMenu = false;

  function runAction(item?: ToolboxActionMenuItem) {
    const inputText = getInputValue(toolboxInput);

    if (item) {
      hideMenu = true;
      sleep(200).then(() => {
        hideMenu = false;
      });
    }

    if (!inputText) {
      toolboxInput?.focus();
      return;
    }

    actionConfig.callback({ input: inputText, selected: item });
    sendMessage(Message.SEND_EVENT, {
      type: UserEvent.TOOLBOX_ACTION,
      props: {
        host: toolboxConfig.host,
        action: actionConfig.label,
        selected: item?.value,
      },
    });
  }
</script>

{#if actionConfig.type === ToolboxActionType.Button}
  <button class="toolbox-action" on:click={() => runAction()}>{actionConfig.label}</button
  >
{:else if actionConfig.type === ToolboxActionType.Menu}
  <div
    class={inlineClass('toolbox-action pointer-events-none relative flex items-center', {
      'group pointer-events-auto': !hideMenu,
    })}
  >
    {actionConfig.label}
    <span class={inlineClass('ml-1 -rotate-90')}><IconArrowLeft width={12} /></span>
    <div
      class={inlineClass(
        'invisible absolute left-0 z-max min-w-[167px] opacity-0',
        { 'group-hover:visible group-hover:opacity-100': !hideMenu },
        [toolboxConfig.position === 'top' ? 'top-full pt-1.5' : 'bottom-full pb-1.5']
      )}
    >
      <ul class="toolbox-menu rounded-lg p-1.5">
        {#each actionConfig.items as item (item.value)}
          <li class="block w-full">
            <button
              class="pointer-events-auto block w-full rounded-lg p-2 text-left text-sm font-medium text-zinc-300 hover:bg-white/8 hover:text-white focus:bg-white/8 "
              on:click={() => runAction(item)}>{item.label}</button
            >
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  .toolbox-menu {
    position: relative;
    background: linear-gradient(160.85deg, #485ff5 0%, #491fad 87.11%);
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.2) inset,
      0px 4px 36px rgba(0, 0, 0, 0.5);
  }
</style>
