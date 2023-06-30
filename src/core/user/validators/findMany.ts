import { z } from "zod";
import { user } from "./user";
import { toTaskEither } from "@/core/helpers";

export const findManyInput = user
  .pick({
    status: true,
    name: true,
    createdAt: true,
  })
  .partial();

const findManyInDbInput = findManyInput;

const findManyOutput = user.omit({ password: true });
const findManyInDbOutput = findManyOutput;

export const findManyValidator = toTaskEither(findManyInput);
export type FindManyInput = z.infer<typeof findManyInput>;
export type FindManyOutput = z.infer<typeof findManyOutput>;
export type FindManyInDbInput = z.infer<typeof findManyInDbInput>;
export type FindManyInDbOutput = z.infer<typeof findManyInDbOutput>;
