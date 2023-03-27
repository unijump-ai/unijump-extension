<script lang="ts">
  export let items: any[];
  export let displayField = null;

  function getDisplayValue(item: any) {
    return displayField ? item[displayField] : item;
  }
</script>

{#if items.length}
  <ul class="bg-white/5 border border-white/10 rounded-lg">
    {#each items as item (getDisplayValue(item))}
      <li class="flex justify-between p-4 border-b border-white/10 last:border-b-0">
        <p>{getDisplayValue(item)}</p>
        <div class="actions">
          <slot name="actions" {item} />
        </div>
      </li>
    {/each}
  </ul>
{/if}
