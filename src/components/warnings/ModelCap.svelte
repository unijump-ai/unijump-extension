<script lang="ts">
  import { appManager } from '$lib/app';
  import { errorStore } from '$lib/store';

  const { store: appStore } = appManager;

  function selectDefaultModel() {
    const defaultModel = $appStore.models[0];

    appManager.selectModel(defaultModel);
    errorStore.set(null);
  }

  $: waitUntil = $errorStore?.message;
</script>

<p>
  You've reached usage cap for {$appStore.selectedModel.title || 'selected model'}.
  {#if waitUntil}
    <span>Wait until {waitUntil} or </span>
  {/if}
  <button class="underline" on:click={selectDefaultModel}>Use default model</button>
</p>
