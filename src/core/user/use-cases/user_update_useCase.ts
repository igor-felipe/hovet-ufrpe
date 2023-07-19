import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as R from "ramda";
import {
  updateValidator,
  UpdateInput,
  UpdateOutput,
  UpdateInDbInput,
} from "@/core/user/validators/user_update_validator";

import { GenerateHash } from "@/core/ports/hash";
import { UpdateInDb } from "@/core/ports/repositories/user_repository";

export type Transform = (
  data: UpdateInput,
) => TE.TaskEither<Error, UpdateInDbInput>;

export const transform = (hash: GenerateHash) => (data: UpdateInput) => {
  const obj = R.filter((e) => e !== undefined)({
    ...data,
    email: data.email?.toLowerCase(),
  });

  return data.password === undefined
    ? TE.right(obj)
    : pipe(
        data.password,
        hash,
        TE.map((passwordHash) => ({
          ...obj,
          password: passwordHash,
        })),
      );
};

export type Ctx = {
  updateInDb: UpdateInDb;
  generateHash: GenerateHash;
};

export type Update = (ctx: Ctx) => UpdateUseCase;

export type UpdateUseCase = (
  data: UpdateInput,
) => TE.TaskEither<Error, UpdateOutput>;

export const update: Update = (ctx: Ctx) => (data: UpdateInput) => {
  return pipe(
    data,
    updateValidator,
    TE.chain(transform(ctx.generateHash)),
    TE.chain(ctx.updateInDb),
  );
};
