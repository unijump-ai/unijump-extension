<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { fade } from 'svelte/transition';
  import { errorStore } from '$lib/store';
  import {
    ServiceBusyException,
    CloudflareException,
    UnauthorizedException,
  } from '$lib/exceptions';
  import Problem from './Problem.svelte';
  import Session from './Session.svelte';
  import Busy from './Busy.svelte';

  $: Warning = getWarningComponent($errorStore);
  $: onWarningChange(Warning);

  function getWarningComponent(error: Error) {
    if (!error) return null;

    if (error instanceof CloudflareException || error instanceof UnauthorizedException) {
      return Session;
    }

    if (error instanceof ServiceBusyException) {
      return Busy;
    }

    return Problem;
  }

  function onWarningChange(Warning: typeof SvelteComponent) {
    if (!Warning || Warning === Session) return;

    setTimeout(() => errorStore.set(null), 3000);
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
