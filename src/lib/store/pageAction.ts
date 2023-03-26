import type { PageName } from '$lib/navigation';
import type { AllPromptArgs } from '$lib/prompt/prompt.types';
// import type { ToolboxWebsiteConfig } from '$lib/toolbox/toolbox.types';
import { writable, type Writable } from 'svelte/store';

interface PageAction {
  page: PageName;
  args: AllPromptArgs;
  run: boolean;
  input: HTMLElement;
}

export const createPageActionStore = (activePageStore: Writable<PageName>) => {
  const pageActionStore = writable<PageAction>(null);

  const run = (page: PageName, args: AllPromptArgs, input: HTMLElement, run = true) => {
    activePageStore.set(page);
    pageActionStore.set({ page, args, input, run });
  };

  const clear = () => pageActionStore.set(null);

  return {
    subscribe: pageActionStore.subscribe,
    run,
    clear,
  };
};
