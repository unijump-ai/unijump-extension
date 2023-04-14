<script lang="ts">
  import IconSend from '$assets/icons/send.svg?component';
  import { autoHeight } from '$lib/actions';
  import { bindKeyEvent, ModifierKey } from '$lib/keyboard';
  import { sleep } from '$lib/utils';
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;
  export let inputText = '';
  export const focus = focusInput;

  const dispatch = createEventDispatcher();
  let chatInput: HTMLTextAreaElement;

  $: disableSend = disabled || !inputText;

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
  class="absolute bottom-0 left-0 h-auto w-full bg-black/20 px-6 py-4 backdrop-blur-[100px] transition-all no-backdrop-blur:bg-darkPurple-800 {disabled
    ? 'pointer-events-none'
    : ''}"
>
  <div
    class="flex rounded-[10px] border border-white/10 bg-white/8 p-[7px] pl-3 focus-within:ring-1 focus-within:ring-white/80"
  >
    <textarea
      class="mt-1 h-6 max-h-48 flex-1 resize-none self-center bg-transparent  text-sm font-medium placeholder-zinc-500 outline-none"
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
      use:autoHeight={{ watch: inputText, emptyHeight: 24 }}
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
