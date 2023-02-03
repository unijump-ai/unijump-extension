<script lang="ts">
  import { errorStore } from '$lib/store';
  import {
    CloudflareException,
    SseException,
    UnauthorizedException,
  } from '$lib/exceptions';
  import Problem from './Problem.svelte';
  import Session from './Session.svelte';
  import { fade } from 'svelte/transition';

  $: Warning = getWarningComponent($errorStore);

  function getWarningComponent(error: Error) {
    if (!error) return null;

    if (error instanceof CloudflareException || error instanceof UnauthorizedException) {
      return Session;
    }

    // TODO: Make better warning flow
    setTimeout(() => {
      errorStore.set(null);
    }, 3000);

    return Problem;
  }
</script>

{#if $errorStore}
  <div
    transition:fade={{ duration: 150 }}
    class="absolute inset-x-14 bottom-6 bg-amber-400 text-zinc-800 text-xl font-bold p-4 text-center rounded-xl"
  >
    <svelte:component this={Warning} />
  </div>
{/if}
