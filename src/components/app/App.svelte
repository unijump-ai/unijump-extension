<script lang="ts">
  import { PageName } from '$lib/navigation';
  import { activePage } from '$lib/store';
  import Chat from '$components/pages/Chat.svelte';
  import Paraphraser from '$components/pages/Paraphraser.svelte';
  import AppSidebar from './AppSidebar.svelte';
  import Warnings from '$components/warnings/Warnings.svelte';
</script>

<div
  class="relative bg-modal h-full grid grid-cols-[64px_1fr] rounded-[20px] text-white select-none font-sans overflow-hidden"
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
