import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { Response } from "express";
import { getError } from "@/core/helpers";

export const mapAll =
  (res: Response) => (taskEither: TE.TaskEither<Error, unknown>) =>
    pipe(
      taskEither,
      TE.map((result) => res.json(result)),
      TE.mapLeft(getError),
      TE.mapLeft((result) => res.status(result.code).json(result.details)),
    );
