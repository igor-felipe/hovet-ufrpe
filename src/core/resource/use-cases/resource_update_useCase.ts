import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import {
  updateValidator,
  UpdateInput,
  UpdateOutput,
} from "@/core/resource/validators/resource_update_validator";
import { UpdateInDb } from "@/core/ports/repositories/resource_repository";

export type Ctx = {
  updateInDb: UpdateInDb;
};

export type Update = (ctx: Ctx) => UpdateUseCase;

export type UpdateUseCase = (
  data: UpdateInput,
) => TE.TaskEither<Error, UpdateOutput>;

export const update: Update = (ctx: Ctx) => (data: UpdateInput) =>
  pipe(data, updateValidator, TE.chain(ctx.updateInDb));
