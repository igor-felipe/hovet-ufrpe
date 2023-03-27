import { z } from "zod";

import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { ValidationError } from "./errors";

export const toValidationError =
  <T extends z.AnyZodObject>(validador: T) =>
  (data: z.infer<T>): TE.TaskEither<ValidationError, z.infer<T>> =>
    pipe(data, validador.safeParse, (result) =>
      result.success
        ? TE.right(result.data)
        : TE.left(new ValidationError(result.error as z.ZodError)),
    );
