export class BluexpressApiError extends Error {
  readonly httpStatus: number;
  readonly endpoint: string;
  readonly body: unknown;

  constructor(message: string, opts: { httpStatus: number; endpoint: string; body: unknown }) {
    super(message);
    this.name = "BluexpressApiError";
    this.httpStatus = opts.httpStatus;
    this.endpoint = opts.endpoint;
    this.body = opts.body;
  }
}

export class BluexpressConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BluexpressConfigError";
  }
}

export class BluexpressValidationError extends Error {
  readonly endpoint: string;
  readonly issues: unknown;

  constructor(message: string, opts: { endpoint: string; issues: unknown }) {
    super(message);
    this.name = "BluexpressValidationError";
    this.endpoint = opts.endpoint;
    this.issues = opts.issues;
  }
}
