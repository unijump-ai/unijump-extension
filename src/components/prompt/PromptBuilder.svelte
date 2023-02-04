<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type {
    AllPromptArgs,
    PromptConfig,
    SelectedPromptArgs,
  } from '$lib/prompt/prompt.types';
  import PromptArgs from './PromptArgs.svelte';
  import { errorStore, selectedText } from '$lib/store';
  import TagBuilder from '$components/elements/TagBuilder.svelte';

  export let config: PromptConfig;

  const dispatch = createEventDispatcher();

  let selectedArgKeys = {};
  let userTags: string[] = [];
  let inputEl: HTMLTextAreaElement;

  $: inputText = $selectedText;
  $: selectedArgs = getSelectedArgs(selectedArgKeys);

  onMount(() => {
    inputEl.focus();
  });

  function getSelectedArgs(selectedArgKeys: SelectedPromptArgs) {
    return Object.keys(selectedArgKeys).map((argKey) => {
      const values = selectedArgKeys[argKey];
      const promptArg = config.args.find((arg) => arg.key === argKey);

      return promptArg.list.filter((promptArg) => values.includes(promptArg.value));
    });
  }

  function buildPrompt() {
    const allArgs = {
      ...selectedArgKeys,
      user: userTags,
    } satisfies AllPromptArgs;

    const input = config.input(allArgs, inputText);
    const initial = config.initialPrompt(input);

    dispatch('prompt', { initial, input });
  }

  function onInputKeydown(evt: KeyboardEvent) {
    evt.stopPropagation();
  }
</script>

<div>
  <h3 class="text-sm mb-4">Input</h3>
  <textarea
    bind:this={inputEl}
    bind:value={inputText}
    class="block mb-6 w-full text-white px-4 py-3 text-sm font-medium bg-white/8 border border-white/10 rounded-md resize-none focus:ring-1 focus:ring-white/80 focus:outline-none"
    rows={6}
    on:keydown={onInputKeydown}
  />
  {#each config.args as arg}
    <PromptArgs {arg} bind:selectedKeys={selectedArgKeys[arg.key]} />
  {/each}
  <h5 class="text-sm mb-3">Selected Tags</h5>
  <div class="p-3 pb-2 pr-2 mb-5 bg-white/8 border border-white/10 rounded-md">
    {#each selectedArgs as selectedArgList}
      {#each selectedArgList as selectedArgItem}
        <span class="tag-selected inline-flex mr-1 mb-1">{selectedArgItem.title}</span>
      {/each}
    {/each}
    {#each userTags as userTag}
      <span class="tag-selected inline-flex mr-1 mb-1">{userTag}</span>
    {/each}
    <TagBuilder bind:tags={userTags}>+ Add Tag</TagBuilder>
  </div>
  <button
    on:click={() => buildPrompt()}
    disabled={!inputText || !!$errorStore}
    class="btn-primary">UniText it!</button
  >
</div>
