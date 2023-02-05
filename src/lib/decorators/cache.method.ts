import { ExpiryCache } from '$lib/cache';

export function Cache(maxAge: number) {
  return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const cacheResponse = (res: any) => {
      cache.set(res);
      return res;
    };
    const originalMethod = descriptor.value;
    const cache = new ExpiryCache(maxAge);

    descriptor.value = function (...args: any[]) {
      const cachedResponse = cache.get();

      if (cachedResponse) {
        return cachedResponse;
      }

      const response = originalMethod.apply(this, args);

      if (response instanceof Promise) {
        return response.then(cacheResponse);
      }

      return cacheResponse(response);
    };
  };
}
