import ExpiryMap from 'expiry-map';
import { v4 as uuidv4 } from 'uuid';

export class ExpiryCache<T> {
  private cache: ExpiryMap;
  private key: string;

  constructor(maxAge: number) {
    this.cache = new ExpiryMap(maxAge);
    this.key = uuidv4();
  }

  get(): T | void {
    return this.cache.get(this.key);
  }

  set(value: T): void {
    this.cache.set(this.key, value);
  }
}
