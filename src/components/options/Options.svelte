<script lang="ts">
  import { options } from '$lib/store';
  import IconMinus from '$assets/icons/minus-circle.svg?component';
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
          <p class="font-bold mb-4">Disabled websites</p>
          <ul class="bg-white/5 border border-white/10 rounded-lg">
            {#each $options.disabledWidgetHosts as host}
              <li
                class="flex justify-between p-4 border-b border-white/10 last:border-b-0"
              >
                <p>{host}</p>
                <button
                  class="text-zinc-400 hover:text-white"
                  on:click={() => options.toggleWidgetHost(host)}
                >
                  <IconMinus />
                </button>
              </li>
            {/each}
          </ul>
        </li>
      </ul>
    </div>
  </div>
{/if}
