import type { EventAdapter } from '../event.types';

interface AmplitudeAdapterOptions {
  apiKey: string;
  debug?: boolean;
}

interface AmplitudeEvent {
  event_type: string;
  user_id: string;
  device_id: string;
  event_properties?: Record<string, string | number | boolean>;
  app_version: string;
  platform: string;
  ip: string | '$remote';
  os_name: string;
  os_version: string;
}

interface AmplutideEventBody {
  api_key: string;
  events: AmplitudeEvent[];
}

export function adapter({
  apiKey,
  debug = false,
}: AmplitudeAdapterOptions): EventAdapter<AmplutideEventBody> {
  let disabled = false;

  if (!apiKey) {
    debug && console.debug('Amplitude apiKey is not set! Disabling events...');
    disabled = true;
  }

  return {
    name: 'Amplitude',
    transform(type, props, extensionInfo): AmplutideEventBody {
      const event: AmplitudeEvent = {
        event_type: type,
        user_id: extensionInfo.userId,
        device_id: extensionInfo.deviceId,
        app_version: extensionInfo.version,
        ip: '$remote',
        platform: extensionInfo.ua.browser.name,
        os_name: extensionInfo.ua.os.name,
        os_version: extensionInfo.ua.os.version,
      };

      if (props) {
        event.event_properties = props;
      }

      return {
        api_key: apiKey,
        events: [event],
      };
    },
    async send({ transformed }) {
      if (disabled) {
        debug && console.debug('Disabled amplitude event:', transformed);
        return;
      }

      const apiUrl = 'https://api2.amplitude.com/2/httpapi';

      await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(transformed),
      });
    },
  };
}
