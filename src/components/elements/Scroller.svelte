<script lang="ts">
  import { onMount } from 'svelte';
  import { ScrollerController } from './Scroller.controller';

  export let scrollerController: ScrollerController | null = null;
  let scrollElement: HTMLDivElement;

  onMount(() => {
    scrollerController = new ScrollerController(scrollElement);
  });
</script>

<div
  class="h-full overflow-y-auto w-full {$$props.class || ''}"
  bind:this={scrollElement}
>
  <slot scroller={scrollerController} />
</div>
