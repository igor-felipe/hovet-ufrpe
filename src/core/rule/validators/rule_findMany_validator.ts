import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { rule } from "./rule_validator";

const findManyInput = rule
  .pick({
    userId: true,
    resourceId: true,
    permission: true,
  })
  .partial();

const findManyInDbInput = findManyInput;
const findManyOutput = rule;
const findManyInDbOutput = rule;

export const findManyValidator = toTaskEither(findManyInput);

export type FindManyInput = z.infer<typeof findManyInput>;
export type FindManyOutput = z.infer<typeof findManyOutput>;
export type FindManyInDbInput = z.infer<typeof findManyInDbInput>;
export type FindManyInDbOutput = z.infer<typeof findManyInDbOutput>;
