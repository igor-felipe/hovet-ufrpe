import argon2 from "argon2";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { AuthError, ValidationError } from "@/core/errors";
import type { GenerateHash, VerifyHash } from "@/core/ports/hash";

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
      () => new ValidationError(`Could not verify password hash`),
    ),
    TE.chain((e) =>
      e ? TE.right(true) : TE.left(new AuthError("Wrong password")),
    ),
  );
