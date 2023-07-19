import { z } from "zod";
import * as TE from "fp-ts/TaskEither";
import { DefaultError, UnknownError, ValidationError } from "./errors";

export const toValidationError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return new ValidationError({ error: error.flatten().fieldErrors });
  }
  return new ValidationError("Unknown error");
};

type Validator<T> = {
  parse: (data: unknown) => T;
};

export const toTaskEither =
  <T>(validator: Validator<T>) =>
  (data: unknown) =>
    TE.tryCatch(async () => validator.parse(data), toValidationError);

export const getError = (error: Error) =>
  error instanceof DefaultError ? error : new UnknownError();
