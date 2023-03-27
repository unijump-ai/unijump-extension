<script lang="ts">
  import IconMinus from '$assets/icons/minus-circle.svg?component';
  import BoxList from '$components/elements/BoxList.svelte';
  import { options } from '$lib/store';
  import { inlineClass } from '$lib/utils';

  function onDisabledChange(evt: Event) {
    const target = evt.target as HTMLInputElement;

    options.updateWidgetDisabled(target.checked);
  }
</script>

{#if $options}
  <div
    class="h-full pt-8 px-6 bg-gradient-to-b from-darkPurple-800 to-darkPurple-900 bg-center text-white"
  >
    <div class="max-w-md mx-auto">
      <div>
        <h2 class="mb-4 text-2xl">Widget</h2>
        <ul>
          <li class="py-6">
            <label class="flex justify-between items-center">
              <p class="font-bold text-base">Disable for all websites</p>
              <input
                class="mt-1"
                type="checkbox"
                checked={$options.widgetDisabled}
                on:change={onDisabledChange}
              />
            </label>
          </li>
          <li
            class={inlineClass('py-6 border-t border-t-white/10', {
              'opacity-40 pointer-events-none': $options.widgetDisabled,
            })}
          >
            <p class="font-bold mb-4">
              Disabled websites ({$options.disabledWidgetHosts.length})
            </p>
            <BoxList items={$options.disabledWidgetHosts}>
              <svelte:fragment slot="actions" let:item>
                <button
                  class="text-zinc-400 hover:text-white"
                  on:click={() => options.toggleWidgetHost(item)}
                >
                  <IconMinus />
                </button>
              </svelte:fragment>
            </BoxList>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="my-4 text-2xl">Toolbox</h2>
        <ul>
          <li class={inlineClass('py-6')}>
            <p class="font-bold mb-4">
              Disabled websites ({$options.disabledToolboxHosts.length})
            </p>
            <BoxList items={$options.disabledToolboxHosts}>
              <svelte:fragment slot="actions" let:item>
                <button
                  class="text-zinc-400 hover:text-white"
                  on:click={() => options.toggleToolboxHost(item)}
                >
                  <IconMinus />
                </button>
              </svelte:fragment>
            </BoxList>
          </li>
        </ul>
      </div>
    </div>
  </div>
{/if}
