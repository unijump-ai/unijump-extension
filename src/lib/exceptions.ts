export class CloudflareException extends Error {
  constructor() {
    super();
    this.name = CloudflareException.name;
  }
}

export class UnauthorizedException extends Error {
  constructor() {
    super();
    this.name = UnauthorizedException.name;
  }
}

export class ServiceBusyException extends Error {
  constructor() {
    super();
    this.name = ServiceBusyException.name;
  }
}
export class UnknownException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = UnknownException.name;
  }
}
export class SseException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = SseException.name;
  }
}

export class ApiException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = ApiException.name;
  }
}

const exceptions = [
  CloudflareException,
  UnauthorizedException,
  UnknownException,
  SseException,
  ApiException,
  ServiceBusyException,
];

export const getExceptionByName = (exceptionName: string) => {
  const exception = exceptions.find((exception) => exception.name === exceptionName);

  return exception;
};
