import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/user/validators/user_create_validator";
import { CreateInDb } from "@/core/ports/repositories/user_repository";
import { GenerateHash } from "@/core/ports/hash";
import { ValidationError } from "@/core/errors";
import { userStatus } from "../validators/user_validator";

export type Ctx = {
  createInDb: CreateInDb;
  generateHash: GenerateHash;
};

export type Transform = (
  data: V.CreateInput,
) => TE.TaskEither<ValidationError, V.CreateInDbInput>;

export const transform =
  (hash: GenerateHash): Transform =>
  (data) =>
    pipe(
      data,
      () => hash(data.password),
      TE.map((password) => ({
        ...data,
        password,
        email: data.email.toLowerCase(),
        status: userStatus.ENABLED,
      })),
    );

export type CreateUseCase = (
  data: V.CreateInput,
) => TE.TaskEither<ValidationError, V.CreateOutput>;

export type Create = (ctx: Ctx) => CreateUseCase;

export const create: Create = (ctx) => (data) =>
  pipe(
    data,
    V.createValidator,
    TE.chain(transform(ctx.generateHash)),
    TE.chain(ctx.createInDb),
  );
