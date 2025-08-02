export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

export class RenderError extends Error {
  constructor(message: string, options: ErrorOptions ) {
    // The options object allows you to pass a `cause` object,
    // to preserve the original error for e.g. the stack trace:
    // new RenderError('Render failed', { cause: err });
    super(message, options);
    this.name = 'RenderError';
  }
}
