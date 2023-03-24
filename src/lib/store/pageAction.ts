import type { PageName } from '$lib/navigation';
import type { AllPromptArgs } from '$lib/prompt/prompt.types';
import { writable, type Writable } from 'svelte/store';

interface PageAction {
  page: PageName;
  args: AllPromptArgs;
  run: boolean;
}

export const createPageActionStore = (activePageStore: Writable<PageName>) => {
  const pageActionStore = writable<PageAction>(null);

  const run = (page: PageName, args: AllPromptArgs, run = true) => {
    activePageStore.set(page);
    pageActionStore.set({ page, args, run });
  };

  const clear = () => pageActionStore.set(null);

  return {
    subscribe: pageActionStore.subscribe,
    run,
    clear,
  };
};
