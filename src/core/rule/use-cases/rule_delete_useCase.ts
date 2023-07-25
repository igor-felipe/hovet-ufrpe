import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/rule/validators";
import { DeleteInDb } from "@/core/ports/repositories/rule_repository";
import { ValidationError } from "@/core/errors";

export type Ctx = {
  deleteInDb: DeleteInDb;
};

export type Delete = (ctx: Ctx) => DeleteUseCase;

export type DeleteUseCase = (
  data: V.DeleteInput,
) => TE.TaskEither<ValidationError, V.DeleteOutput>;

export const deleteR: Delete = (ctx) => (data) =>
  pipe(data, V.deleteValidator, TE.chain(ctx.deleteInDb));
