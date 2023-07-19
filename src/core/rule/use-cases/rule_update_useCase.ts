import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import {
  updateValidator,
  UpdateInput,
  UpdateOutput,
} from "@/core/rule/validators/rule_update_validator";
import { UpdateInDb } from "@/core/ports/repositories/rule_repository";

export type Ctx = {
  updateInDb: UpdateInDb;
};

export type Update = (ctx: Ctx) => UpdateUseCase;

export type UpdateUseCase = (
  data: UpdateInput,
) => TE.TaskEither<Error, UpdateOutput>;

export const update: Update = (ctx: Ctx) => (data: UpdateInput) => {
  return pipe(data, updateValidator, TE.chain(ctx.updateInDb));
};
