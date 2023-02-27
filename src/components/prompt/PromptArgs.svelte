<script lang="ts">
  import type { PromptArg, PromptArgItem } from '$lib/prompt/prompt.types';

  export let arg: PromptArg;
  export let selectedValues: PromptArgItem[] = [];

  const groupId = `group-${arg.key}`;
</script>

<div class="mb-5">
  <h5 class="text-sm mb-3" id={groupId}>{arg.title}</h5>
  <div role="group" aria-labelledby={groupId}>
    <ul>
      {#each arg.list as argItem}
        <li class="inline-flex mr-1 mb-1">
          <label
            class="cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 {selectedValues.includes(
              argItem
            )
              ? 'tag-selected'
              : 'tag'}"
          >
            <input
              class="absolute opacity-0 h-0 w-0"
              type="checkbox"
              bind:group={selectedValues}
              value={argItem}
            />
            <span>{argItem.label}</span>
          </label>
        </li>
      {/each}
    </ul>
  </div>
</div>
