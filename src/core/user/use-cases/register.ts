import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/user/validators/register";
import { RegisterInDb } from "@/core/ports/repositories/user-repository";
import { GenerateHash } from "@/core/ports/hash";
import { ValidationError } from "@/core/erros";
import { userStatus } from "../validators/user";

export type Ctx = {
  registerInDb: RegisterInDb;
  generateHash: GenerateHash;
};

export type Transform = (
  data: V.RegisterInput,
) => TE.TaskEither<ValidationError, V.RegisterInDbInput>;

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

export type RegisterUseCase = (
  data: V.RegisterInput,
) => TE.TaskEither<ValidationError, V.RegisterOutput>;

export type Register = (ctx: Ctx) => RegisterUseCase;

export const register: Register = (ctx) => (data) => {
  return pipe(
    data,
    V.registerValidator,
    TE.chain(transform(ctx.generateHash)),
    TE.chain(ctx.registerInDb),
  );
};
