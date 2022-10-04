export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;

    // good pratice, and that class is dropped from the error stack
    // improves error visualization
    Error.captureStackTrace(this, this.constructor);
  }
}
