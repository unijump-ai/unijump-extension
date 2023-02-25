import browser from 'webextension-polyfill';

export const getURL = (path: string) => browser.runtime.getURL(path);

export const getExtensionManifest = <
  T extends keyof browser.Manifest.WebExtensionManifest
>(
  field?: T
) => {
  const manifest = browser.runtime.getManifest();

  if (field) {
    return manifest[field];
  }

  return manifest;
};
