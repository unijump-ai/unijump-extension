<script lang="ts">
  import Options from '$components/options/Options.svelte';
  import ToolboxDev from '$components/toolbox/ToolboxDev.svelte';
  import { AppContext } from '$lib/context';
  import { setContext } from 'svelte';
  import ContentPage from './entries/contentScript/primary/ContentPage.svelte';

  const pages = {
    '/options': {
      id: 'unijump-options',
      component: Options,
    },
  } as const;

  const page = pages[window.location.pathname];
  let inputEl: HTMLDivElement;

  setContext(AppContext.Root, '#unijump-app');
</script>

{#if page}
  <div id={page.id}>
    <svelte:component this={page.component} />
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

      <p class="mb-4">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate quae,
        sapiente in velit tempora repellat magni inventore unde laboriosam autem molestiae
        placeat quam consequatur ea accusamus esse aliquam eum. Itaque illo maxime
        doloribus saepe corporis, beatae ut veniam possimus non nisi nihil porro animi
        dolore, labore excepturi delectus ex magni.
      </p>

      <p class="mb-4">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate quae,
        sapiente in velit tempora repellat magni inventore unde laboriosam autem molestiae
        placeat quam consequatur ea accusamus esse aliquam eum. Itaque illo maxime
        doloribus saepe corporis, beatae ut veniam possimus non nisi nihil porro animi
        dolore, labore excepturi delectus ex magni.
      </p>

      <div class="my-3">
        {#if inputEl}
          <ToolboxDev {inputEl} />
        {/if}
        <!-- <input
          id="uj-dev-input"
          class="w-full p-3 border border-slate-500 rounded-xl"
          placeholder="Input text"
          type="text"
        /> -->
        <div
          bind:this={inputEl}
          class="border border-slate-300 p-2 rounded-xl mt-1"
          id="uj-dev-input"
          contenteditable="true"
          role="textbox"
          spellcheck="false"
        />
      </div>
    </div>
  </div>
  <div id="unijump-app">
    <ContentPage />
  </div>
{/if}
