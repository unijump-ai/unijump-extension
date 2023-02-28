<script lang="ts">
  import IconSearch from '$assets/icons/search.svg?component';

  export let value = '';
  export let placeholder = '';
</script>

<div
  class="px-4 flex items-center bg-white/8 border text-zinc-300 border-white/10 rounded-full transition-all focus-within:border-white"
>
  <IconSearch width={16} />
  <input
    type="text"
    class="flex-1 bg-transparent pl-2 py-4 text-white text-xs font-medium placeholder:zinc-300 outline-none"
    {placeholder}
    bind:value
    on:keydown|stopPropagation={() => {}}
    on:keypress|stopPropagation={() => {}}
  />
</div>
