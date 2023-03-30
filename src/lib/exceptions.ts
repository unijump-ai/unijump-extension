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

export class ExpiredSessionException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = ExpiredSessionException.name;
  }
}

export class ModelCapExceededException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = ModelCapExceededException.name;
  }
}

const exceptions = [
  CloudflareException,
  UnauthorizedException,
  UnknownException,
  ServiceBusyException,
  ExpiredSessionException,
  ModelCapExceededException,
];

export const getExceptionByName = (exceptionName: string) => {
  const exception = exceptions.find((exception) => exception.name === exceptionName);

  return exception;
};
