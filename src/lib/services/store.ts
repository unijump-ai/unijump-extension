import { get, writable, type Writable } from 'svelte/store';

export class StoreService<T> {
  store: Writable<T>;

  constructor(state: T) {
    this.store = writable(state);
  }

  setState(state: T) {
    this.store.set(state);
  }

  getState() {
    return get(this.store);
  }

  updateState(state: Partial<T>) {
    this.store.update((currentState) => ({
      ...currentState,
      ...state,
    }));
  }
}
