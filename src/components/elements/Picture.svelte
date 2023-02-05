<script lang="ts">
  import type { ImageToolsSource } from 'src/types/image-tools';

  export let image: ImageToolsSource;
  export let alt: string;
</script>

<picture>
  {#each Object.entries(image.sources) as [format, images]}
    <source
      srcset={images.map((i) => `${i.src} ${i.w}w`).join(', ')}
      type="image/{format}"
    />
  {/each}
  <img src={image.fallback.src} {alt} />
</picture>
