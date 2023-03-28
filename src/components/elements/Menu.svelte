<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte';

  export interface MenuItem {
    label: string;
    icon?: typeof SvelteComponent;
    onClick?: (evt: MouseEvent) => void;
    link?: string;
  }
</script>

<script lang="ts">
  import IconCheck from '$assets/icons/check.svg?component';
  import { clickOutside } from '$lib/actions';
  import { inlineClass } from '$lib/utils';

  export let name: string;
  export let items: MenuItem[] = [];
  export let position: 'top' | 'bottom' = 'top';
  export let open = false;
  export let activeItemLabel: string = '';
  export let style: 'modal' | 'default' = 'default';

  function toggleMenu() {
    open = !open;
  }

  function onItemClick(item: MenuItem, evt: MouseEvent) {
    toggleMenu();

    if (item.link) {
      window.open(item.link, '_blank');
      return;
    }

    item.onClick?.(evt);
  }
</script>

<div class="{name} relative">
  <slot />
  {#if open}
    <div
      class={inlineClass('absolute right-0 z-max', [
        position === 'top' ? 'top-full pt-1' : 'bottom-full pb-1',
      ])}
      use:clickOutside={`.${name}`}
      on:clickoutside={() => toggleMenu()}
    >
      <ul
        class={inlineClass(
          'min-w-[186px] p-2 text-zinc-300 border border-white/20 rounded-xl shadow-lg',
          [
            style === 'modal'
              ? 'bg-black/20 backdrop-blur-[40px] no-backdrop-blur:bg-darkPurple-800'
              : 'bg-slate-800',
          ]
        )}
      >
        {#each items as item (item.label)}
          <li class="w-full">
            <button
              class={inlineClass(
                'flex w-full items-center text-xs font-medium p-2.5 rounded-lg hover:bg-white/8 hover:text-white focus:bg-white/8 focus:text-white transition-all',
                {
                  'text-white': activeItemLabel === item.label,
                }
              )}
              on:click|stopPropagation={(evt) => onItemClick(item, evt)}
            >
              {#if item.icon}
                <svelte:component this={item.icon} class="mr-2.5" width={16} />
              {/if}
              <span class="flex-1 text-left">{item.label}</span>
              {#if activeItemLabel === item.label}
                <span class="ml-2">
                  <IconCheck width={12} height={12} />
                </span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
