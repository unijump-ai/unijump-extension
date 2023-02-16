<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import IconSend from '$assets/icons/send.svg?component';
  import { sleep } from '$lib/utils';
  import { bindKeyPress } from '$lib/a11y';

  export let disabled = false;
  export let inputText = '';
  export const focus = focusInput;

  const dispatch = createEventDispatcher();

  let chatInput: HTMLInputElement;
  $: disableSend = disabled || !inputText;

  onMount(async () => {
    await sleep(100);

    if (!disabled) {
      focusInput();
    }
  });

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
  class="absolute bottom-0 left-0 w-full h-auto bg-black/20 px-6 py-4 backdrop-blur-[100px] transition-all {disabled
    ? 'pointer-events-none'
    : ''}"
>
  <div
    class="flex bg-white/8 border p-[7px] pl-3 border-white/10 rounded-[10px] focus-within:ring-1 focus-within:ring-white/80"
  >
    <input
      type="text"
      class="flex-1 bg-transparent outline-none font-medium placeholder-zinc-500"
      placeholder="Write your message..."
      bind:this={chatInput}
      bind:value={inputText}
      on:keydown|stopPropagation={() => {}}
      on:keypress|stopPropagation={bindKeyPress(['Enter'], () => sendMessage())}
      on:focus={onChatInputFocus}
    />
    <button
      class="btn-primary-icon"
      disabled={disableSend}
      on:click={() => sendMessage()}
    >
      <IconSend width={16} />
    </button>
  </div>
</div>
