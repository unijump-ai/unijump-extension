import { ApiException } from '$lib/exceptions';
import { Connection } from '$lib/extension/messaging/messaging.constants';
import type {
  ConnectionPayloadMap,
  ConnectionMessageMap,
  ConnectionHandler,
  MessagePayloadMap,
  MessagePayload,
} from '$lib/extension/messaging/messaging.types';

interface ConnectionPayloadMapArray {
  [Connection.CHAT]: ConnectionPayloadMap[Connection.CHAT][];
  [Connection.ANOTHER]: ConnectionPayloadMap[Connection.ANOTHER][];
}

// const message = 'Hello how can i helop you today?';
const message = `
JavaScript is a single-threaded programming language, meaning that it runs code in a single thread and can only process one task at a time. So, there is no built-in "sleep" function in JavaScript that can halt the execution of code for a specified amount of time.

However, there are a few ways to simulate a sleep-like behavior:

1. Using \`setTimeout\`: You can use \`setTimeout\` to delay the execution of a function. For example:

    \`\`\`
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function doSomething() {
      console.log('Taking a break...');
      await sleep(2000);
      console.log('Two second later');
    }
    \`\`\`

2. Using \`setInterval\`: You can use \`setInterval\` to repeatedly execute a function after a specified time interval, and use \`clearInterval\` to stop it. For example:

    \`\`\`
    let counter = 0;
    const intervalId = setInterval(() => {
      console.log(\`Interval run: \$\{++counter\}\`);
      if (counter === 5) {
        console.log('Stopping the interval');
        clearInterval(intervalId);
      }
    }, 1000);
    \`\`\`
`;

const devMessages: ConnectionPayloadMapArray = {
  [Connection.CHAT]: [
    {
      done: false,
      response: {
        text: message.substring(0, 300),
        conversationId: 'a',
        messageId: 'b',
      },
    },
    {
      done: false,
      response: {
        text: message.substring(0, 600),
        conversationId: 'a',
        messageId: 'b',
      },
    },
    {
      done: false,
      response: {
        text: message,
        conversationId: 'a',
        messageId: 'b',
      },
    },
    {
      done: true,
      response: {
        text: '',
        conversationId: 'a',
        messageId: 'b',
      },
    },
  ],
  [Connection.ANOTHER]: [undefined, undefined],
};

export const openConnection = <T extends keyof ConnectionPayloadMap>(
  type: T,
  message: ConnectionMessageMap[T],
  callback: (payload: ConnectionPayloadMap[T], error?: Error) => void
): ConnectionHandler<T> => {
  const sendMessages = (_type: typeof type, _callback: typeof callback) => {
    const messages = devMessages[type];
    messages.forEach((message: any, index: number) => {
      const timeout = index * 1000 + 1000;
      setTimeout(() => callback(message), timeout);
    });
  };

  sendMessages(type, callback);

  return {
    disconnect: () => {},
    sendMessage: () => {
      sendMessages(type, callback);
    },
  };
};

// TODO: Temp;
let counter = 0;

export const sendMessage = <T extends keyof MessagePayloadMap>(
  message: T,
  payload?: MessagePayload<T>
) => {
  counter++;
  if (counter % 2 === 0) {
    return { message };
  }

  return { error: new ApiException('Not fund'), message };
};
