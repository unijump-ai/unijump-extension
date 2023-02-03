<button
  class="btn font-medium text-sm text-white flex border border-white/10 py-[10px] px-6 rounded-full w-full justify-center items-center bg-white/8 hover:bg-white/20 transition-all"
  {...$$restProps}
  on:click
>
  <slot />
</button>

<style>
  :global(.btn > svg) {
    display: inline-flex;
    margin-right: 6px;
  }
</style>
