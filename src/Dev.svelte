<script lang="ts">
  import './app.css';
  import App from '$components/app/App.svelte';
  import AppCurtain from '$components/app/AppCurtain.svelte';
  import Options from '$components/options/Options.svelte';

  let visible = true;

  const pages = {
    '/options': Options,
  };
  const page = pages[window.location.pathname];

  function toggleModal() {
    visible = !visible;
  }
</script>

{#if page}
  <div id="app">
    <svelte:component this={page} />
  </div>
{:else}
  <div class="max-w-3xl mx-auto pt-8">
    <ul class="flex flex-col gap-4">
      <li>
        <button
          class="w-full block bg-slate-200 p-4 text-center rounded-lg"
          on:click={toggleModal}>Toggle Modal</button
        >
      </li>
      <li>
        <a class="w-full block bg-slate-200 p-4 text-center rounded-lg" href="/options"
          >Options Page</a
        >
      </li>
    </ul>
  </div>
{/if}

<AppCurtain {visible} on:close={toggleModal}>
  <div class="w-full h-full max-w-5xl mx-auto">
    {#if visible}
      <App on:close={toggleModal} />
    {/if}
  </div>
</AppCurtain>
