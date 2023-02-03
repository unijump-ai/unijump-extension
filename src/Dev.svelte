<script lang="ts">
  import './app.css';
  import App from '$components/app/App.svelte';
  import { setContext } from 'svelte';

  setContext('getURL', (url: string) => url);

  let visible = true;

  function closeModal() {
    visible = !visible;
  }
</script>

<div id="content">
  <div
    class="fixed h-full w-full left-0 top-0 p-4 z-[9999999] transition-all {visible
      ? 'opacity-100 visible bg-white/80'
      : 'opacity-0 invisible'}"
  >
    <div class="w-full h-full max-w-5xl mx-auto">
      {#if visible}
        <App on:close={closeModal} />
      {/if}
    </div>
  </div>
</div>

<style>
  #content {
    width: 100%;
    position: relative;
    height: 100%;
    background-color: white;
  }
</style>
