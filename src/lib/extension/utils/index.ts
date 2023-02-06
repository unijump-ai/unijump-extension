import browser from 'webextension-polyfill';

export const getURL = (path: string) => browser.runtime.getURL(path);
