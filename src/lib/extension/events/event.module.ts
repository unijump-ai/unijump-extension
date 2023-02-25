import type { EventAdapter, ExtensionInfo } from './event.types';
import { v4 as uuidv4 } from 'uuid';
import { userAgent } from '$lib/user-agent';
import { ExtensionStorage } from '../storage';
import { getExtensionManifest } from '../utils';
import { StorageArea, StorageKey } from '../storage/storage.constants';

interface EventConfig {
  adapter: EventAdapter;
}

const userIdStorage = new ExtensionStorage<string>(StorageKey.USER_ID, StorageArea.SYNC);
const deviceIdStorage = new ExtensionStorage<string>(
  StorageKey.DEVICE_ID,
  StorageArea.LOCAL
);

export function createEventModule(eventConfig?: EventConfig) {
  let config = eventConfig;

  const getExtensionInfo = async (): Promise<ExtensionInfo> => {
    let userId = await userIdStorage.get();
    let deviceId = await deviceIdStorage.get();

    if (!userId) {
      userId = uuidv4();
      await userIdStorage.set(userId);
    }

    if (!deviceId) {
      deviceId = uuidv4();
      await deviceIdStorage.set(deviceId);
    }

    return {
      version: getExtensionManifest('version') as string,
      deviceId,
      userId,
      ua: userAgent.getResult(),
    };
  };

  const init = (eventConfig: EventConfig) => {
    if (config) {
      console.warn("You've already configured event module!");
      return;
    }

    config = eventConfig;
  };

  const send = async (type: string, props?: Record<string, any>): Promise<void> => {
    if (!config) {
      console.warn('Sending events before init is not allowed!');
      return;
    }

    const { adapter } = config;
    const extensionInfo = await getExtensionInfo();
    const transformed = await adapter.transform?.(type, props, extensionInfo);

    return config.adapter.send({ type, props, transformed });
  };

  return {
    init,
    send,
  };
}
