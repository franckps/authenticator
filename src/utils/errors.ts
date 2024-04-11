export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }

  type: string = "CustomError";
  message: string;
}
