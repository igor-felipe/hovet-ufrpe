import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { prisma } from "../prisma";
import { toDatabaseError } from "../toDatabaseError";
import * as resourceRepo from "@/core/ports/repositories/resource_repository";
import * as V from "@/core/resource/validators";

export const createInDb: resourceRepo.CreateInDb = (data) =>
  pipe(
    TE.tryCatch(
      () => prisma.resource.create({ data }),
      (e) => toDatabaseError(e),
    ),
    TE.map((resource) => resource as V.CreateInDbOutput),
  );

export const updateInDb: resourceRepo.UpdateInDb = (data) =>
  pipe(
    TE.tryCatch(
      () => prisma.resource.update({ data, where: { id: data.id } }),
      (e) => toDatabaseError(e),
    ),
    TE.map((resource) => resource as V.UpdateInDbOutput),
  );

export const getOneInDb: resourceRepo.GetOneInDb = (where) =>
  pipe(
    TE.tryCatch(
      () => prisma.resource.findUniqueOrThrow({ where }),
      (error) => toDatabaseError(error),
    ),
    TE.map((resource) => resource as V.GetOneInDbOutput),
  );

export const findManyInDb: resourceRepo.FindManyInDb = (where) =>
  pipe(
    TE.tryCatch(
      () => prisma.resource.findMany({ where }),
      (error) => toDatabaseError(error),
    ),
    TE.map((resources) => resources as V.FindManyInDbOutput[]),
  );
