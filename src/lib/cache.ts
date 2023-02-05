import ExpiryMap from 'expiry-map';

export class ExpiryCache<T> {
  private cache: ExpiryMap;
  private key: string;

  constructor(maxAge: number) {
    this.cache = new ExpiryMap(maxAge);
    this.key = crypto.randomUUID();
  }

  get(): T | void {
    return this.cache.get(this.key);
  }

  set(value: T): void {
    this.cache.set(this.key, value);
  }
}
