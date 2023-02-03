import { createParser } from 'eventsource-parser';

export const parseStream = async <Res>(
  responseBody: ReadableStream,
  endSequence: string,
  onMessage: (message: Res, done: boolean) => void
) => {
  const parser = createParser((event) => {
    if (event.type === 'event') {
      const response = event.data;
      const done = response === endSequence;
      if (done) {
        onMessage('' as Res, true);
      } else {
        try {
          const parsed = JSON.parse(response);
          onMessage(parsed, false);
        } catch (error) {
          // TODO: Sometimes getting timestamp strings
        }
      }
    }
  });

  for await (const chunk of streamReaderIterable(responseBody)) {
    const str = new TextDecoder().decode(chunk);
    parser.feed(str);
  }
};

export async function* streamReaderIterable(stream: ReadableStream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
