import type { DraggablePosition } from '$components/elements/Draggable.svelte';
import { ExtensionStorage } from '$lib/extension/storage';
import { StorageKey } from '$lib/extension/storage/storage.constants';

export const floatingWidgetPositionStorage = new ExtensionStorage<DraggablePosition>(
  StorageKey.FLOATING_WIDGET_POSITION
);
