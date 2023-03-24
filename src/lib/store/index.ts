import type { ApiSession } from '$lib/api';
import { PageName } from '$lib/navigation';
import { writable } from 'svelte/store';
import { createOptionsStore } from './options';
import { createPageActionStore } from './pageAction';

export const appModalVisible = writable(false);
export const selectedText = writable('');
export const activePage = writable(PageName.Chat);
export const user = writable<ApiSession['user'] | null>(null);
export const errorStore = writable<Error | null>(null);
export const pageAction = createPageActionStore(activePage);
export const options = createOptionsStore();
