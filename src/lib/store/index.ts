import type { ApiSession } from '$lib/api';
import { PageName } from '$lib/navigation';
import { writable } from 'svelte/store';

export const selectedText = writable('');
export const activePage = writable(PageName.Chat);
export const user = writable<ApiSession['user'] | null>(null);
export const errorStore = writable<Error | null>(null);
