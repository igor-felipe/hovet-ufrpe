import argon2 from "argon2";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { ValidationError } from "@/core/erros";
import { GenerateHash, VerifyHash } from "@/core/ports/hash";

export const generateHash: GenerateHash = (password) =>
  pipe(
    TE.tryCatch(
      () => argon2.hash(password),
      () => new ValidationError(`Error generating password hash`),
    ),
  );

export const verifyHash: VerifyHash = (passwordHash, password) =>
  pipe(
    TE.tryCatch(
      () => argon2.verify(passwordHash, password),
      () => new ValidationError(`Password not matched`),
    ),
  );
