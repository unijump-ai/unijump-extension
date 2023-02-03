export class CloudflareException extends Error {
  constructor() {
    super(CloudflareException.name);
  }
}
export class UnauthorizedException extends Error {
  constructor() {
    super(UnauthorizedException.name);
  }
}

export class ServiceBusyException extends Error {
  constructor() {
    super(ServiceBusyException.name);
  }
}
export class UnknownException extends Error {
  constructor() {
    super(UnknownException.name);
  }
}
export class SseException extends Error {
  constructor() {
    super(SseException.name);
  }
}

const exceptions = [
  CloudflareException,
  UnauthorizedException,
  UnknownException,
  SseException,
  ServiceBusyException,
];

export const getExceptionByName = (exceptionName: string) => {
  const exception = exceptions.find((exception) => exception.name === exceptionName);

  return exception;
};
