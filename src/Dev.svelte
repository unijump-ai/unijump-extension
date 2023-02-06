<script lang="ts">
  import './app.css';
  import App from '$components/app/App.svelte';
  import AppCurtain from '$components/app/AppCurtain.svelte';

  let visible = true;

  function toggleModal() {
    visible = !visible;
  }
</script>

<div class="w-full b-white h-100">
  <button on:click={toggleModal} class="btn-primary w-auto">Toggle Modal</button>
  <AppCurtain {visible} on:close={toggleModal}>
    <div class="w-full h-full max-w-5xl mx-auto">
      {#if visible}
        <App on:close={toggleModal} />
      {/if}
    </div>
  </AppCurtain>
</div>
