import { z } from "zod";
import { user } from "./user_validator";
import { toTaskEither } from "@/core/helpers";

const findManyInput = user
  .pick({
    status: true,
    name: true,
    createdAt: true,
  })
  .partial();

const findManyOutput = user.omit({ password: true });
const findManyInDbInput = findManyInput;
const findManyInDbOutput = findManyOutput;

export const findManyValidator = toTaskEither(findManyInput);

export type FindManyInput = z.infer<typeof findManyInput>;
export type FindManyOutput = z.infer<typeof findManyOutput>;
export type FindManyInDbInput = z.infer<typeof findManyInDbInput>;
export type FindManyInDbOutput = z.infer<typeof findManyInDbOutput>;
