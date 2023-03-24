<script lang="ts">
  import { Scroller } from '$components/elements';
  import TagBuilder from '$components/elements/TagBuilder.svelte';
  import { bindKeyEvent } from '$lib/keyboard';
  import { PromptManager } from '$lib/prompt';
  import type { PromptArgItem, PromptConfig } from '$lib/prompt/prompt.types';
  import { errorStore, selectedText } from '$lib/store';
  import { createEventDispatcher, tick } from 'svelte';
  import PromptArgs from './PromptArgs.svelte';

  export let config: PromptConfig;
  export let selectedPromptArgs = PromptManager.createEmptyArgs(config);
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

<div class="h-full relative overflow-hidden">
  <Scroller class="p-6 pb-20">
    <h3 class="text-sm mb-4">Input</h3>
    <textarea
      bind:this={inputEl}
      bind:value={inputText}
      class="block h-36 mb-6 w-full text-white px-4 py-3 text-sm font-medium bg-white/8 border border-white/10 rounded-md resize-none focus:ring-1 focus:ring-white/80 focus:outline-none"
      on:keydown|stopPropagation={bindKeyEvent({
        key: 'Escape',
        onEvent: () => inputEl.blur(),
      })}
      on:keypress|stopPropagation={() => {}}
    />
    {#each config.args as arg}
      <PromptArgs {arg} bind:selectedValues={selectedPromptArgs[arg.key]} />
    {/each}
    <h5 class="text-sm mb-3">Selected Tags</h5>
    <div
      class="flex flex-wrap p-3 pb-2 pr-2 mb-5 bg-white/8 border border-white/10 rounded-md"
    >
      {#each Object.entries(selectedPromptArgs) as [argKey, argItems]}
        {#each argItems as argItem}
          <button
            class="tag-selected inline-flex mr-1 mb-1"
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
    class="absolute w-full h-auto p-3 left-0 bottom-0 bg-white/8 backdrop-blur-[100px] no-backdrop-blur:bg-darkPurple-800"
  >
    <button on:click={() => buildPrompt()} disabled={!!$errorStore} class="btn-primary"
      >{config.ctaLabel || 'Run'}</button
    >
  </div>
</div>
