<script lang="ts">
  import Options from '$components/options/Options.svelte';
  import { AppContext } from '$lib/context';
  import { setContext } from 'svelte';
  import ContentPage from './entries/contentScript/primary/ContentPage.svelte';

  const pages = {
    '/options': Options,
  };
  const page = pages[window.location.pathname];

  setContext(AppContext.Root, '#unitext-app');
</script>

{#if page}
  <div id="app">
    <svelte:component this={page} />
  </div>
{:else}
  <div class="max-w-3xl mx-auto pt-8">
    <ul class="flex flex-col gap-4">
      <li>
        <a class="w-full block bg-slate-200 p-4 text-center rounded-lg" href="/options"
          >Options Page</a
        >
      </li>
    </ul>

    <div class="my-4">
      <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, iste!</h3>

      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate quae,
        sapiente in velit tempora repellat magni inventore unde laboriosam autem molestiae
        placeat quam consequatur ea accusamus esse aliquam eum. Itaque illo maxime
        doloribus saepe corporis, beatae ut veniam possimus non nisi nihil porro animi
        dolore, labore excepturi delectus ex magni.
      </p>

      <input
        class="w-full my-3 p-3 border border-slate-500 rounded-xl"
        placeholder="Input text"
        type="text"
      />
    </div>
  </div>
{/if}

<div id="unitext-app">
  <ContentPage />
</div>
