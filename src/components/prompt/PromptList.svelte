<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { bindKeyPress } from '$lib/a11y';
  import { promptListService, type ListPrompt } from '$lib/services/prompt-list';
  import { errorStore } from '$lib/store';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Star } from '@steeze-ui/heroicons';
  import { inlineClass } from '$lib/utils';
  import Search from '$components/elements/Search.svelte';
  import IconArrowLeft from '$assets/icons/arrow-left.svg?component';

  const dispatch = createEventDispatcher();
  const { store: promptListStore, favoritePrompts } = promptListService;

  let promptLimit = 12;
  let searchInput = '';

  $: onSearchChange(searchInput);
  $: prompts = $promptListStore.prompts.slice(0, promptLimit);

  function onPromptClick(prompt: ListPrompt) {
    dispatch('select', prompt);
  }

  function onFavoriteClick(prompt: ListPrompt) {
    const title = prompt.title;
    if (favoritePrompts.has(title)) {
      favoritePrompts.remove(title);
    } else {
      favoritePrompts.add(title);
    }
  }

  function onSearchChange(searchInput: string) {
    promptListService.search(searchInput);
  }

  function showMorePrompts() {
    promptLimit = $promptListStore.prompts.length;
  }
</script>

<div>
  {#if $promptListStore.isLoading}
    <!-- TODO: Loading indicator -->
  {:else}
    <div class="max-w-full md:max-w-md mx-auto mb-8 mt-2">
      <Search bind:value={searchInput} placeholder="Search prompts" />
    </div>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {#each prompts as prompt}
        <li
          class="group relative flex flex-col justify-between p-4 h-28 bg-white/8 border border-white/10 rounded-xl transition-all hover:bg-white/15 focus:bg-white/15"
          role="button"
          aria-disabled={!!$errorStore}
          title={prompt.title}
          tabindex="0"
          on:click={() => onPromptClick(prompt)}
          on:keypress={bindKeyPress(['Space', 'Enter'], () => onPromptClick(prompt))}
        >
          <h5 class="text-xs pr-3">{prompt.title}</h5>
          <p
            class="text-white/40 text-xs group-hover:text-zinc-300 group-focus:text-white/70 transition-all"
          >
            {prompt.list}
          </p>
          <button
            class={inlineClass(
              'absolute p-1 top-1 right-1 transition-all hover:text-amber-400',
              {
                'text-zinc-500': !$favoritePrompts.includes(prompt.title),
                'text-amber-400': $favoritePrompts.includes(prompt.title),
              }
            )}
            on:click|preventDefault|stopPropagation={() => onFavoriteClick(prompt)}
            on:keypress|preventDefault|stopPropagation={bindKeyPress(
              ['Space', 'Enter'],
              () => onFavoriteClick(prompt)
            )}
          >
            <Icon
              src={Star}
              width={16}
              theme={$favoritePrompts.includes(prompt.title) ? 'solid' : 'outline'}
            />
          </button>
        </li>
      {/each}
    </ul>
    {#if $promptListStore.prompts.length > prompts.length}
      <div class="flex justify-center mt-8">
        <button
          class="flex items-center justify-center px-4 py-2.5 bg-white/8 border border-white/10 rounded-full transition-all hover:bg-white/15"
          on:click={() => showMorePrompts()}
          on:keypress={bindKeyPress(['Space', 'Enter'], () => showMorePrompts())}
        >
          <span class="inline-flex -rotate-90">
            <IconArrowLeft width={16} />
          </span>
        </button>
      </div>
    {/if}
  {/if}
</div>
