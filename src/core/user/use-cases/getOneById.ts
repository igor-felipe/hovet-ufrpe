import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/user/validators";
import { GetOneByIdInDb } from "@/core/ports/repositories/user-repository";
import { NotFoundError, ValidationError } from "@/core/erros";

export type Ctx = {
  getOneByIdInDb: GetOneByIdInDb;
};

export type GetOneById = (ctx: Ctx) => GetOneByIdUseCase;

export type GetOneByIdUseCase = (
  data: V.GetOneByIdInput,
) => TE.TaskEither<ValidationError, V.GetOneByIdOutput>;

export const getOneById: GetOneById = (ctx) => (data) => {
  return pipe(
    data,
    V.getOneByIdValidator,
    TE.chain(ctx.getOneByIdInDb),
    TE.chain(TE.fromNullable(new NotFoundError("User not found"))),
  );
};
