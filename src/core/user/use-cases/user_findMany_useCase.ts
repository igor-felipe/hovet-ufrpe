import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as R from "ramda";
import * as V from "@/core/user/validators";
import { ValidationError } from "@/core/errors";
import { FindManyInDb } from "@/core/ports/repositories/user_repository";

export type Ctx = {
  findManyInDb: FindManyInDb;
};

export type FindMany = (ctx: Ctx) => FindManyUseCase;

export type FindManyUseCase = (
  data: V.FindManyInput,
) => TE.TaskEither<ValidationError, V.FindManyOutput[]>;

export const findMany: FindMany = (ctx) => (data) => {
  return pipe(
    data,
    V.findManyValidator,
    TE.map(R.filter(R.isNotNil)),
    TE.chain(ctx.findManyInDb),
  );
};
