<script context="module" lang="ts">
  export interface DraggablePosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { inlineClass, inlineStyle } from '$lib/utils';
  import IconDrag from '$assets/icons/drag.svg?component';
  import IconDraggerHandle from '$assets/icons/dragger-handle.svg?component';

  export let position: DraggablePosition;
  export let handlePosition: 'top' | 'bottom' = 'bottom';
  export let padding = 16;
  export let showHandle = true;

  const dispatch = createEventDispatcher();

  let isHovered = false;
  let grabbed = false;
  let x: number;
  let y: number;
  let diffX: number;
  let diffY: number;
  let draggableEl: HTMLDivElement;

  $: style = inlineStyle({
    top: position.top ? `${position.top}px` : 'auto',
    left: position.left ? `${position.left}px` : 'auto',
    right: position.right ? `${position.right}px` : 'auto',
    bottom: position.bottom ? `${position.bottom}px` : 'auto',
  });
  $: isHandleVisible = showHandle || isHovered || grabbed;

  function getElementRect() {
    return draggableEl.getBoundingClientRect();
  }

  function calculateDiff(mouseX: number, mouseY: number) {
    const boundingRectangle = getElementRect();

    diffX = mouseX - boundingRectangle.x;
    diffY = mouseY - boundingRectangle.y;
  }

  function updatePosition() {
    const newX = window.innerWidth - padding - draggableEl.clientWidth;
    const newY = window.innerHeight - padding - draggableEl.clientHeight;

    x = Math.max(Math.min(newX, x), padding);
    y = Math.max(Math.min(newY, y), padding);

    position = {
      left: x < window.innerWidth / 2 ? x : null,
      right:
        x < window.innerWidth / 2
          ? null
          : window.innerWidth - x - draggableEl.clientWidth,
      top: y < window.innerHeight / 2 ? y : null,
      bottom:
        y < window.innerHeight / 2
          ? null
          : window.innerHeight - y - draggableEl.clientHeight,
    };
  }

  function onMouseDown(evt: MouseEvent) {
    calculateDiff(evt.clientX, evt.clientY);
    grabbed = true;
  }

  function onMouseMove(evt: MouseEvent) {
    if (!grabbed) return;

    x = evt.clientX - diffX;
    y = evt.clientY - diffY;
    updatePosition();
  }

  function onMouseUp() {
    if (!grabbed) return;

    grabbed = false;
    dispatch('dragend', position);
  }

  function onWindowResize() {
    if (!x || !y) {
      const boundingRect = getElementRect();

      x = boundingRect.x;
      y = boundingRect.y;
    }

    updatePosition();
  }
</script>

<svelte:window
  on:mouseup={onMouseUp}
  on:mousemove={onMouseMove}
  on:resize={onWindowResize}
/>
<div
  class={inlineClass('fixed select-none z-[9999999]', [])}
  {style}
  bind:this={draggableEl}
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
>
  <div class={inlineClass('z-20', { 'order-2': handlePosition === 'top' })}>
    <slot hovered={isHovered} dragging={grabbed} />
  </div>
  <div
    class={inlineClass('absolute left-1/2 -translate-x-1/2 -z-10', {
      'cursor-grabbing': grabbed,
      'cursor-grab': !grabbed,
      'order-1': handlePosition === 'top',
      'translate-y-0 opacity-100 visible transition-all delay-700': isHandleVisible,
      'opacity-0 invisible transition-none delay-75 pointer-events-none':
        !isHandleVisible,
      '-translate-y-1/2': !isHandleVisible && handlePosition === 'bottom',
      'translate-y-1/2': !isHandleVisible && handlePosition === 'top',
    })}
    on:mousedown={onMouseDown}
  >
    <span
      class={inlineClass('group relative inline-flex text-zinc-100', [
        handlePosition === 'top' ? '-rotate-180 align-bottom' : 'rotate-0 align-top',
      ])}
    >
      <IconDraggerHandle />
      <span
        class="text-zinc-500 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 group-hover:text-zinc-700"
      >
        <IconDrag />
      </span>
    </span>
  </div>
</div>
