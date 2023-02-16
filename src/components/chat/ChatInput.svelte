<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import IconSend from '$assets/icons/send.svg?component';
  import { inlineStyle, sleep } from '$lib/utils';
  import { bindKeyEvent } from '$lib/a11y';

  export let disabled = false;
  export let inputText = '';
  export const focus = focusInput;

  const dispatch = createEventDispatcher();
  let inputHeight = 24;
  let chatInput: HTMLTextAreaElement;

  $: disableSend = disabled || !inputText;
  $: onInputTextChange(inputText);

  onMount(async () => {
    await sleep(100);

    if (!disabled) {
      focusInput();
    }
  });

  async function onInputTextChange(inputText: string) {
    inputHeight = 24;
    await tick();

    if (!inputText || !chatInput) return;

    inputHeight = chatInput.scrollHeight;
    chatInput.scrollTop = chatInput.scrollHeight;
  }

  function focusInput() {
    chatInput.focus();
  }

  function sendMessage() {
    if (disableSend) return;

    dispatch('message', inputText);
    inputText = '';
    focusInput();
  }

  async function onChatInputFocus() {
    await sleep(200);

    if (!chatInput) return;

    chatInput.selectionStart = chatInput.selectionEnd = 10000;
  }

  function onKeyPress(evt: KeyboardEvent) {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault();
      sendMessage();
    }
  }
</script>

<div
  class="absolute bottom-0 left-0 w-full h-auto bg-black/20 px-6 py-4 backdrop-blur-[100px] transition-all {disabled
    ? 'pointer-events-none'
    : ''}"
>
  <div
    class="flex bg-white/8 border p-[7px] pl-3 border-white/10 rounded-[10px] focus-within:ring-1 focus-within:ring-white/80"
  >
    <textarea
      class="flex-1 h-8 bg-transparent outline-none font-medium placeholder-zinc-500 resize-none max-h-48 self-center"
      style={inlineStyle({
        height: `${inputHeight}px`,
      })}
      cols={1}
      placeholder="Write your message..."
      bind:this={chatInput}
      bind:value={inputText}
      on:keydown|stopPropagation={bindKeyEvent(['Escape'], () => chatInput.blur())}
      on:keypress|stopPropagation={onKeyPress}
      on:focus={onChatInputFocus}
    />
    <button
      class="btn-primary-icon self-end"
      disabled={disableSend}
      on:click={() => sendMessage()}
    >
      <IconSend width={16} />
    </button>
  </div>
</div>
