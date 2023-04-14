<script lang="ts">
  import { Scroller } from '$components/elements';
  import LoadingDots from '$components/elements/LoadingDots.svelte';
  import TagBuilder from '$components/elements/TagBuilder.svelte';
  import { bindKeyEvent } from '$lib/keyboard';
  import { PromptManager } from '$lib/prompt';
  import type { PromptArgItem, PromptConfig } from '$lib/prompt/prompt.types';
  import { errorStore, selectedText } from '$lib/store';
  import { inlineClass } from '$lib/utils';
  import { createEventDispatcher, tick } from 'svelte';
  import PromptArgs from './PromptArgs.svelte';

  export let config: PromptConfig;
  export let selectedPromptArgs = PromptManager.createEmptyArgs(config);
  export let loading = false;
  export const focus = async () => {
    await tick();
    inputEl?.focus();
  };
  export const build = async () => {
    await tick();
    buildPrompt();
  };

  const dispatch = createEventDispatcher();

  let inputEl: HTMLTextAreaElement;

  $: inputText = $selectedText;

  function buildPrompt() {
    if (loading) return;

    if (!inputText) {
      alert('Please enter input text');
      focus();
      return;
    }

    const input = config.input(selectedPromptArgs, inputText);
    const initial = config.initialPrompt(input);

    dispatch('prompt', { initial, input, args: selectedPromptArgs });
  }

  function removeArg(argKey: string, argItem: PromptArgItem) {
    let selectedArgs = selectedPromptArgs[argKey];

    selectedArgs = selectedArgs.filter((arg) => arg !== argItem);

    selectedPromptArgs = {
      ...selectedPromptArgs,
      [argKey]: selectedArgs,
    };
  }
</script>

<div class="relative h-full overflow-hidden">
  <Scroller class="p-6 pb-20">
    <h3 class="mb-4 text-sm">Input</h3>
    <textarea
      bind:this={inputEl}
      bind:value={inputText}
      class="mb-6 block h-36 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white hover:border-white/25 focus:outline-none focus:ring-1 focus:ring-white/80"
      on:keydown|stopPropagation={bindKeyEvent({
        key: 'Escape',
        onEvent: () => inputEl.blur(),
      })}
      on:keypress|stopPropagation={() => {}}
    />
    {#each config.args as arg}
      <PromptArgs {arg} bind:selectedValues={selectedPromptArgs[arg.key]} />
    {/each}
    <h5 class="mb-3 text-sm">Selected Tags</h5>
    <div
      class="mb-5 flex flex-wrap rounded-lg border border-white/10 bg-white/8 p-3 pb-2 pr-2"
    >
      {#each Object.entries(selectedPromptArgs) as [argKey, argItems]}
        {#each argItems as argItem}
          <button
            class="tag-selected mr-1 mb-1 inline-flex"
            on:click={() => removeArg(argKey, argItem)}>{argItem.label}</button
          >
        {/each}
      {/each}
      {#if config.userTags}
        <TagBuilder bind:tags={selectedPromptArgs['user']}
          >+ {config.addUserTagLabel || ''}</TagBuilder
        >
      {/if}
    </div>
  </Scroller>
  <div
    class="absolute left-0 bottom-0 h-auto w-full bg-white/8 p-3 backdrop-blur-[100px] no-backdrop-blur:bg-darkPurple-800"
  >
    <button
      on:click={() => buildPrompt()}
      disabled={!!$errorStore}
      class="btn-primary relative"
    >
      <span class={inlineClass({ 'opacity-0': loading })}>
        {config.ctaLabel || 'Run'}
      </span>
      {#if loading}
        <span class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <LoadingDots as="span" />
        </span>
      {/if}
    </button>
  </div>
</div>
