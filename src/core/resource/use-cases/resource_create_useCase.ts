import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as V from "@/core/resource/validators/resource_create_validator";
import { CreateInDb } from "@/core/ports/repositories/resource_repository";
import { ValidationError } from "@/core/errors";

export type Ctx = {
  createInDb: CreateInDb;
};

export type CreateUseCase = (
  data: V.CreateInput,
) => TE.TaskEither<ValidationError, V.CreateOutput>;

export type Create = (ctx: Ctx) => CreateUseCase;

export const create: Create = (ctx) => (data) =>
  pipe(data, V.resourceValidator, TE.chain(ctx.createInDb));
