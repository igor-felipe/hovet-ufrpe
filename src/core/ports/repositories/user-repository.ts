import * as TE from "fp-ts/TaskEither";
import * as V from "@/core/user/validators/";
import { DatabaseError } from "@/core/erros";

export type RegisterInDb = (
  data: V.RegisterInDbInput,
) => TE.TaskEither<DatabaseError, V.RegisterInDbOutput>;

export type UpdateInDb = (
  data: V.UpdateInDbInput,
) => TE.TaskEither<DatabaseError, V.UpdateInDbOutput>;

export type LoginInDb = (
  data: V.LoginInDbInput,
) => TE.TaskEither<DatabaseError, V.LoginInDbOutput>;

export type GetOneByIdInDb = (
  where: V.GetOneByIdInput,
) => TE.TaskEither<DatabaseError, V.GetOneByIdInDbOutput>;

export type FindManyInDb = (
  where: V.FindManyInDbInput,
) => TE.TaskEither<DatabaseError, V.FindManyInDbOutput[]>;
