import { z } from "zod";
import * as TE from "fp-ts/TaskEither";

export class ValidationError extends Error {
  details: { [x: string]: string[] | undefined };

  constructor(zodError: z.ZodError) {
    super("ValidationError");
    this.details = zodError.flatten().fieldErrors;
  }
}

const toValidationError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return new ValidationError(error);
  }
  if (error instanceof Error) {
    return new Error(error.message);
  }
  return new Error("Unknown Error");
};

type Validator<T> = {
  parse: (data: unknown) => T;
};

export const validation =
  <T>(validator: Validator<T>) =>
  (data: unknown) =>
    TE.tryCatch(async () => validator.parse(data), toValidationError);

export function getErrorDetails(error: Error | ValidationError) {
  return error instanceof ValidationError ? error.details : error.message;
}
