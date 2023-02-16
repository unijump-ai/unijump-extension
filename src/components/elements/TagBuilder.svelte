<script lang="ts">
  import type { PromptArgItem } from '$lib/prompt/prompt.types';
  import { tick } from 'svelte';

  export let tags: PromptArgItem[] = [];

  let isAdding = false;
  let tagInput: HTMLSpanElement;
  let addButton: HTMLButtonElement;

  async function addTag(value: string) {
    tags = [...tags, { value, label: value }];
  }

  async function toggleAdding(adding: boolean) {
    if (!adding) {
      tagInput.blur();
    }

    isAdding = adding;
    await tick();

    if (adding) {
      tagInput.innerText = '';
      tagInput?.focus();
    } else {
      addButton?.focus();
    }
  }

  function onInputBlur() {
    isAdding = false;
  }

  function onInputKeydown(evt: KeyboardEvent) {
    const target = evt.target as HTMLSpanElement;
    const value = target.innerText;

    const events = [
      {
        keys: ['Enter', ','],
        onPress() {
          if (!value) {
            return;
          }

          addTag(value);
          target.innerText = '';
        },
      },
      {
        keys: ['Escape'],
        onPress() {
          toggleAdding(false);
        },
      },
    ];

    const activeEvent = events.find((event) => event.keys.includes(evt.key));

    if (!activeEvent) return;

    evt.preventDefault();

    activeEvent.onPress();
  }
</script>

<span
  role="textbox"
  contenteditable="true"
  class="tag mr-1 mb-1 focus:outline-none {isAdding ? 'inline-block' : 'hidden'}"
  bind:this={tagInput}
  on:keypress|stopPropagation={() => {}}
  on:keydown|stopPropagation={onInputKeydown}
  on:blur={onInputBlur}
/>
<button
  class="tag mr-1 mb-1 {isAdding ? 'hidden' : 'inline-block'}"
  bind:this={addButton}
  on:click={() => toggleAdding(true)}><slot /></button
>
