import { Prisma } from "@prisma/client";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { prisma } from "../prisma";

export const createResourceInDB = (data: Prisma.ResourceCreateInput) =>
  TE.tryCatch(() => prisma.resource.create({ data }), E.toError);
