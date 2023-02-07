export class ExtensionStorage<T> {
  constructor(private key: string) {}

  async get(): Promise<T> {
    const value = window.localStorage.getItem(this.key);

    if (value) {
      return JSON.parse(value);
    }
  }

  async set(value: T): Promise<void> {
    window.localStorage.setItem(this.key, JSON.stringify(value));
  }
}
