import ExpiryMap from 'expiry-map';

export enum CacheKey {
  ACCESS_TOKEN = 'access-token',
  SESSION = 'session',
}

const cache = new ExpiryMap(1000 * 10);

export const getCache = (key: CacheKey) => {
  return cache.get(key);
};

export const setCache = (key: CacheKey, value: any) => {
  return cache.set(key, value);
};
