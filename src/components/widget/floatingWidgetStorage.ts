import type { DraggablePosition } from '$components/elements/Draggable.svelte';
import { ExtensionStorage } from '$lib/extension/storage';

export const floatingWidgetPositionStorage = new ExtensionStorage<DraggablePosition>(
  'floating-widget-position'
);
