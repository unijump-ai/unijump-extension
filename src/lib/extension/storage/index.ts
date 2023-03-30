import browser from 'webextension-polyfill';

export class ExtensionStorage<T> {
  private storage: browser.Storage.StorageArea;

  constructor(private key: string, area: 'local' | 'sync' = 'sync') {
    this.storage = browser.storage[area] || browser.storage.local; // Opera doesn't suppport sync storage
  }

  async get(): Promise<T | null> {
    const values = await this.storage.get(this.key);

    return values[this.key] || null;
  }

  async set(value: T): Promise<void> {
    await this.storage.set({ [this.key]: value });
  }
}
