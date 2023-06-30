/* eslint-disable @typescript-eslint/no-unused-vars */

import { Prisma } from "@prisma/client";
import * as TE from "fp-ts/TaskEither";
import { prisma } from "../prisma";
import { toDatabaseError } from "../errors/toDatabaseError";

export const createRuleInDB = (data: Prisma.RuleCreateInput) =>
  TE.tryCatch(
    () => prisma.rule.create({ data }),
    (e) => toDatabaseError(e),
  );
