import { get, writable } from 'svelte/store';

export const createArrayStore = <T>(defaultValue?: T[]) => {
  const store = writable<T[]>(defaultValue || []);

  const getState = () => get(store);

  const has = (item: T) => {
    const state = getState();

    return state.includes(item);
  };

  const add = (item: T) => {
    if (has(item)) return;

    const state = getState();
    const updatedState = [...state, item];

    store.set(updatedState);
  };

  const addMany = (items: T[]) => {
    items.forEach((item) => add(item));
  };

  const remove = (item: T) => {
    const state = getState();
    const updatedState = state.filter((i) => i !== item);

    store.set(updatedState);
  };

  return {
    subscribe: store.subscribe,
    set: store.set,
    has,
    add,
    addMany,
    remove,
  };
};
