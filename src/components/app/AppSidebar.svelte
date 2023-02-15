<script lang="ts">
  import { PageName, pages } from '$lib/navigation';
  import { activePage } from '$lib/store';
  import unitextLogo from '$assets/logo.png?w=40;80&format=webp;png&picture';
  import Picture from '$components/elements/Picture.svelte';

  function navigate(pageName: PageName) {
    activePage.set(pageName);
  }
</script>

<div class="py-4 flex flex-col border-r justify-between items-center border-r-white/8">
  <Picture width={40} image={unitextLogo} alt="Unitext icon" />
  <ul>
    {#each pages as page}
      <li>
        <button
          class="my-3 w-12 h-12 flex justify-center items-center text-zinc-500 border rounded-xl hover:text-zinc-100 transition-all {$activePage ===
          page.name
            ? 'text-zinc-100 bg-white/8 border-white/10'
            : 'border-transparent'}"
          title={page.name}
          on:click={() => navigate(page.name)}
        >
          <svelte:component this={page.icon} width={24} height={24} />
          <span class="sr-only">{page.name}</span>
        </button>
      </li>
    {/each}
  </ul>
  <span />
</div>
