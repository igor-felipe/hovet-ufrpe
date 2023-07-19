import * as TE from "fp-ts/TaskEither";
import * as V from "@/core/resource/validators";
import { DatabaseError } from "@/core/errors";

export type CreateInDb = (
  data: V.CreateInDbInput,
) => TE.TaskEither<DatabaseError, V.CreateInDbOutput>;

export type UpdateInDb = (
  data: V.UpdateInDbInput,
) => TE.TaskEither<DatabaseError, V.UpdateInDbOutput>;

export type GetOneInDb = (
  where: V.GetOneInput,
) => TE.TaskEither<DatabaseError, V.GetOneInDbOutput>;

export type FindManyInDb = (
  where: V.FindManyInDbInput,
) => TE.TaskEither<DatabaseError, V.FindManyInDbOutput[]>;
