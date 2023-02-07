<script lang="ts">
  import IconSearch from '$assets/icons/search.svg?component';

  export let value = '';
  export let placeholder = '';
</script>

<div
  class="px-4 flex items-center bg-white/8 border text-zinc-300 border-white/10 rounded-full"
>
  <IconSearch width={16} />
  <input
    class="flex-1 bg-transparent pl-2 py-4 text-white text-xs font-medium placeholder:zinc-300 outline-none"
    {placeholder}
    bind:value
    type="text"
  />
</div>
