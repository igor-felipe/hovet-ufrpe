/* eslint-disable @typescript-eslint/no-unused-vars */
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { prisma } from "../prisma";
import { toDatabaseError } from "../toDatabaseError";
import * as ruleRepo from "@/core/ports/repositories/rule_repository";
import * as V from "@/core/rule/validators";

export const createInDb: ruleRepo.CreateInDb = (data) =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.rule.create({
          data: {
            user: {
              connect: {
                id: data.userId,
              },
            },
            resource: {
              connect: {
                name: data.resourceName,
              },
            },
            permission: data.permission,
          },
        }),
      (e) => toDatabaseError(e),
    ),
    TE.map((rule) => rule as V.CreateInDbOutput),
  );

export const updateInDb: ruleRepo.UpdateInDb = (data) =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.rule.update({
          data: {
            permission: data.permission,
          },
          where: {
            id: data.id,
          },
        }),
      (e) => toDatabaseError(e),
    ),
    TE.map((rule) => rule as V.UpdateInDbOutput),
  );

export const getOneInDb: ruleRepo.GetOneInDb = (where) =>
  pipe(
    TE.tryCatch(
      () => prisma.rule.findUniqueOrThrow({ where }),
      (error) => toDatabaseError(error),
    ),
    TE.map((rule) => rule as V.GetOneInDbOutput),
  );

export const findManyInDb: ruleRepo.FindManyInDb = (where) =>
  pipe(
    TE.tryCatch(
      () => prisma.rule.findMany({ where }),
      (error) => toDatabaseError(error),
    ),
    TE.map((rules) => rules as V.FindManyInDbOutput[]),
  );

export const deleteInDb = (where: any) =>
  pipe(
    TE.tryCatch(
      () => prisma.rule.delete({ where }),
      (error) => toDatabaseError(error),
    ),
  );
