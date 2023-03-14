<script lang="ts">
  import IconOptions from '$assets/icons/options.svg?component';
  import unijumpLogo from '$assets/logo.png?w=40;80&format=webp;png&picture';
  import Picture from '$components/elements/Picture.svelte';
  import { sendMessage } from '$lib/extension/messaging';
  import { Message } from '$lib/extension/messaging/messaging.constants';
  import { PageName, pages } from '$lib/navigation';
  import { socialLinks } from '$lib/social';
  import { activePage } from '$lib/store';

  function navigate(pageName: PageName) {
    activePage.set(pageName);
  }

  function openOptionsPage() {
    sendMessage(Message.OPEN_OPTIONS_PAGE, undefined);
  }
</script>

<div
  class="relative py-4 flex flex-col border-r justify-between items-center border-r-white/8 z-20"
>
  <Picture width={40} image={unijumpLogo} alt="UniJump icon" />
  <ul class="absolute w-full flex flex-col left-0 items-center top-1/2 -translate-y-1/2">
    {#each pages as page}
      <li>
        <button
          class="group/tooltip relative my-3 w-12 h-12 flex justify-center items-center text-zinc-500 border rounded-xl hover:text-zinc-100 transition-all {$activePage ===
          page.name
            ? 'text-zinc-100 bg-white/8 border-white/10'
            : 'border-transparent'}"
          on:click={() => navigate(page.name)}
        >
          <svelte:component this={page.icon} width={24} height={24} />
          <span class="tooltip">{page.name}</span>
        </button>
      </li>
    {/each}
  </ul>
  <div class="flex flex-col items-center">
    <ul>
      {#each socialLinks as socialLink}
        <li class="group/tooltip relative flex first:mt-0">
          <a
            class="p-1.5 inline-flex text-zinc-500 transition-all hover:text-zinc-100"
            href={socialLink.href}
            target="_blank"
            rel="noreferrer"
          >
            <svelte:component this={socialLink.icon} width={16} height={16} />
            <span class="tooltip">{socialLink.name}</span>
          </a>
        </li>
      {/each}
    </ul>
    <hr class="h-[1px] w-6 border-none bg-white/8 my-4" />
    <button
      class="group/tooltip relative p-1 text-zinc-500 transition-all hover:text-zinc-100"
      on:click={openOptionsPage}
    >
      <IconOptions width={24} height={24} />
      <span class="tooltip">Options</span>
    </button>
  </div>
</div>
