<script lang="ts">
  import type { PromptArgItem } from '$lib/prompt/prompt.types';
  import { bindKeyEvent } from '$lib/keyboard';
  import { tick } from 'svelte';

  export let tags: PromptArgItem[] = [];

  let isAdding = false;
  let tagInput = '';
  let tagInputEl: HTMLSpanElement;
  let addButton: HTMLButtonElement;

  async function addTag(value: string) {
    tags = [...tags, { value, label: value }];
  }

  async function toggleAdding(adding: boolean) {
    if (!adding) {
      tagInputEl.blur();
    }

    isAdding = adding;
    await tick();

    if (adding) {
      tagInputEl.innerText = '';
      tagInputEl?.focus();
    } else {
      addButton?.focus();
    }
  }

  function onInputBlur() {
    isAdding = false;
  }

  function appendTag(value: string, event: KeyboardEvent) {
    if (!value) return;

    event.preventDefault();

    addTag(value);
    tagInput = '';
  }
</script>

<span
  role="textbox"
  contenteditable="true"
  class="tag mr-1 mb-1 focus:outline-none {isAdding ? 'inline-block' : 'hidden'}"
  bind:this={tagInputEl}
  bind:innerHTML={tagInput}
  on:keypress|stopPropagation={() => {}}
  on:keydown|stopPropagation={bindKeyEvent(
    { key: 'Enter', onEvent: (evt) => appendTag(tagInput, evt) },
    { key: ',', onEvent: (evt) => appendTag(tagInput, evt) },
    {
      key: 'Escape',
      onEvent: (evt) => {
        evt.preventDefault();
        toggleAdding(false);
      },
    }
  )}
  on:blur={onInputBlur}
/>
<button
  class="tag mr-1 mb-1 {isAdding ? 'hidden' : 'inline-block'}"
  bind:this={addButton}
  on:click={() => toggleAdding(true)}><slot /></button
>
