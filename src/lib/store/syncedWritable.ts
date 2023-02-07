import type { Readable } from 'svelte/store';

export const syncedWritable = <T, S extends Readable<T>>(
  store: S,
  syncFunction: (value: T) => Promise<void>
) => {
  let sync = false;

  const startSync = () => {
    sync = true;
  };

  store.subscribe((value) => {
    if (!sync) return;

    try {
      syncFunction(value);
    } catch (error) {} // eslint-disable-line
  });

  return {
    ...store,
    startSync,
  };
};
