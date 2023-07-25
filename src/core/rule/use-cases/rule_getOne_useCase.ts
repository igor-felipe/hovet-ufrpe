import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/rule/validators";
import { GetOneInDb } from "@/core/ports/repositories/rule_repository";
import { ValidationError } from "@/core/errors";

export type Ctx = {
  getOneInDb: GetOneInDb;
};

export type GetOne = (ctx: Ctx) => GetOneUseCase;

export type GetOneUseCase = (
  data: V.GetOneInput,
) => TE.TaskEither<ValidationError, V.GetOneOutput>;

export const getOne: GetOne = (ctx) => (data) =>
  pipe(data, V.getOneValidator, TE.chain(ctx.getOneInDb));
