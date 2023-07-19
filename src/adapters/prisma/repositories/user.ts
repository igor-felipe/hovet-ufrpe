import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { prisma } from "../prisma";
import { toDatabaseError } from "../toDatabaseError";
import * as V from "@/core/user/validators";
import * as userRepo from "@/core/ports/repositories/user_repository";

const select: Record<keyof Omit<V.User, "password">, boolean> = {
  id: true,
  email: true,
  name: true,
  status: true,
  cpf: true,
  date: true,
  createdAt: true,
  updatedAt: true,
};
export const createInDb: userRepo.CreateInDb = (data) => {
  return pipe(
    TE.tryCatch(
      () => prisma.user.create({ data, select }),
      (error) => toDatabaseError(error),
    ),
    TE.map((user) => user as V.CreateInDbOutput),
  );
};

export const updateInDb: userRepo.UpdateInDb = (data) =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.user.update({
          where: { id: data.id },
          data,
          select,
        }),
      (error) => toDatabaseError(error),
    ),
    TE.map((user) => user as V.UpdateInDbOutput),
  );

export const getOneInDb: userRepo.GetOneInDb = (where) =>
  pipe(
    TE.tryCatch(
      () => prisma.user.findUniqueOrThrow({ where, select }),
      (error) => toDatabaseError(error),
    ),
    TE.map((user) => user as V.GetOneInDbOutput),
  );

export const loginInDb: userRepo.LoginInDb = (where) => {
  const selectWithPassword: Record<keyof V.User, boolean> = {
    password: true,
    id: true,
    email: true,
    name: true,
    status: true,
    cpf: true,
    date: true,
    createdAt: true,
    updatedAt: true,
  };
  return pipe(
    TE.tryCatch(
      () =>
        prisma.user.findUniqueOrThrow({ where, select: selectWithPassword }),
      (error) => toDatabaseError(error),
    ),
    TE.map((user) => (user as V.LoginInDbOutput) ?? null),
  );
};

export const findManyInDb: userRepo.FindManyInDb = (where) =>
  pipe(
    TE.tryCatch(
      () => prisma.user.findMany({ where, select }),
      (error) => toDatabaseError(error),
    ),
    TE.map((users) => users as V.FindManyInDbOutput[]),
  );
