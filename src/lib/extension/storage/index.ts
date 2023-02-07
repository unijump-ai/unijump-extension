import browser from 'webextension-polyfill';

// TODO: Opera doesn't support sync storage, we should use local for it
export class ExtensionStorage<T> {
  constructor(private key: string) {}

  async get(): Promise<T | void> {
    const values = await browser.storage.sync.get(this.key);

    return values[this.key];
  }

  async set(value: T): Promise<void> {
    await browser.storage.sync.set({ [this.key]: value });
  }
}
