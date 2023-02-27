<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type {
    AllPromptArgs,
    PromptArgItem,
    PromptConfig,
  } from '$lib/prompt/prompt.types';
  import PromptArgs from './PromptArgs.svelte';
  import { errorStore, selectedText } from '$lib/store';
  import TagBuilder from '$components/elements/TagBuilder.svelte';
  import { bindKeyEvent, getShortcut, ShortcutName } from '$lib/keyboard';

  export let config: PromptConfig;

  const dispatch = createEventDispatcher();

  let selectedPromptArgs: AllPromptArgs = {
    ...config.args.reduce((rv, arg) => {
      rv[arg.key] = [];

      return rv;
    }, {}),
    user: [],
  };
  let inputEl: HTMLTextAreaElement;

  $: inputText = $selectedText;

  onMount(() => {
    inputEl.focus();
  });

  function buildPrompt() {
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

<div>
  <h3 class="text-sm mb-4">Input</h3>
  <textarea
    bind:this={inputEl}
    bind:value={inputText}
    class="block h-36 mb-6 w-full text-white px-4 py-3 text-sm font-medium bg-white/8 border border-white/10 rounded-md resize-none focus:ring-1 focus:ring-white/80 focus:outline-none"
    on:keydown|stopPropagation={bindKeyEvent(
      {
        key: 'Escape',
        onEvent: () => inputEl.blur(),
      },
      getShortcut(ShortcutName.ToggleModal).keyOptions
    )}
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
    <TagBuilder bind:tags={selectedPromptArgs['user']}>+ Add Tag</TagBuilder>
  </div>
  <button
    on:click={() => buildPrompt()}
    disabled={!inputText || !!$errorStore}
    class="btn-primary">UniJump it!</button
  >
</div>
