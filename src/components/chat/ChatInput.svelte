<script lang="ts">
  import IconSend from '$assets/icons/send.svg?component';
  import { bindKeyEvent, ModifierKey } from '$lib/keyboard';
  import { inlineStyle, sleep } from '$lib/utils';
  import { createEventDispatcher, tick } from 'svelte';

  export let disabled = false;
  export let inputText = '';
  export const focus = focusInput;

  const dispatch = createEventDispatcher();
  let inputHeight = 24;
  let chatInput: HTMLTextAreaElement;

  $: disableSend = disabled || !inputText;
  $: onInputTextChange(inputText);

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
</script>

<div
  class="absolute bottom-0 left-0 w-full h-auto bg-black/20 px-6 py-4 backdrop-blur-[100px] no-backdrop-blur:bg-darkPurple-800 transition-all {disabled
    ? 'pointer-events-none'
    : ''}"
>
  <div
    class="flex bg-white/8 border p-[7px] pl-3 border-white/10 rounded-[10px] focus-within:ring-1 focus-within:ring-white/80"
  >
    <textarea
      class="flex-1 mt-1 h-8 bg-transparent outline-none font-medium text-sm  placeholder-zinc-500 resize-none max-h-48 self-center"
      style={inlineStyle({
        height: `${inputHeight}px`,
      })}
      rows={1}
      placeholder="Write your message..."
      bind:this={chatInput}
      bind:value={inputText}
      on:keydown|stopPropagation={bindKeyEvent({
        key: 'Escape',
        onEvent: () => chatInput.blur(),
      })}
      on:keypress|stopPropagation={bindKeyEvent({
        key: 'Enter',
        [ModifierKey.Shift]: false,
        onEvent: (evt) => {
          evt.preventDefault();
          sendMessage();
        },
      })}
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
