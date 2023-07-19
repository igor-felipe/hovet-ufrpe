import * as TE from "fp-ts/TaskEither";
import { ValidationError } from "@/core/errors";

export type GenerateHash = (
  password: string,
) => TE.TaskEither<ValidationError, string>;

export type VerifyHash = (
  passwordHash: string,
  password: string,
) => TE.TaskEither<ValidationError, boolean>;
