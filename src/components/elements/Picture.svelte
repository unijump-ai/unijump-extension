<script lang="ts">
  import type { ImageToolsSource } from 'src/types/image-tools';
  import { getURL } from '$lib/extension/utils';

  export let image: ImageToolsSource;
  export let width: number;
  export let alt: string;

  const getSize = (w: string) => {
    const ratio = Math.round(Number(w) / width);

    return `${ratio}x`;
  };

  $: console.log(image);
</script>

<picture>
  {#each Object.entries(image.sources) as [format, images]}
    <source
      srcset={images.map((i) => `${getURL(i.src)} ${getSize(i.w)}`).join(', ')}
      {width}
      type="image/{format}"
    />
  {/each}
  <img src={getURL(image.fallback.src)} {alt} {width} />
</picture>
