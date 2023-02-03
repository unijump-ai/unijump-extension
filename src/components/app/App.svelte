<script lang="ts">
  import type { ApiSession } from '$lib/api';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Chat from '$components/pages/Chat.svelte';
  import Paraphraser from '$components/pages/Paraphraser.svelte';
  import { sendMessage } from '$lib/messaging';
  import { Message } from '$lib/messaging/messaging.constants';
  import { PageName } from '$lib/navigation';
  import { activePage, errorStore, user } from '$lib/store';
  import AppSidebar from './AppSidebar.svelte';
  import Warnings from '$components/warnings/Warnings.svelte';

  onMount(checkSession);

  async function checkSession() {
    const { message, error } = await sendMessage(Message.GET_SESSION);

    if (error) {
      errorStore.set(error);
      return;
    }

    const session = message as ApiSession;
    user.set(session.user);
  }
</script>

<div
  class="relative app grid grid-cols-[64px_1fr] rounded-[20px] text-white select-none font-sans antialiased overflow-hidden"
  transition:fade={{ duration: 130 }}
>
  <AppSidebar />
  <main class="h-full overflow-hidden">
    {#if $activePage === PageName.Paraphraser}
      <Paraphraser on:close />
    {:else if $activePage === PageName.Chat}
      <Chat on:close />
    {/if}
  </main>
  <Warnings />
</div>

<style>
  .app {
    height: 100%;
    background: url('$assets/bg-grain.png'),
      radial-gradient(
        80.4% 41.5% at 50% 0%,
        rgba(255, 255, 255, 0.16) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      rgba(23, 18, 43, 1);
  }
</style>
