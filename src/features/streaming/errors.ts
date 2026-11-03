export class AuthenticationError extends Error {
  constructor() {
    super('Unauthenticated');

    this.name = AuthenticationError.name;
  }
}

export class NetworkError extends Error {
  constructor(message?: string, options?: { cause?: unknown }) {
    super(`NetworkError: ${message}`, { cause: options?.cause });

    this.name = AuthenticationError.name;
  }
}

export class HTTPError extends Error {
  static fromResponse(response: Response, message?: string) {
    return new HTTPError({
      message,
      status: response.status,
      statusText: response.statusText,
    });
  }
  status: number;
  statusText: string;

  constructor({
    message,
    status,
    statusText,
  }: {
    message?: string;
    status: number;
    statusText: string;
  }) {
    super(`HTTPError: ${message || statusText}`);

    this.name = AuthenticationError.name;
    this.status = status;
    this.statusText = statusText;
  }
}
