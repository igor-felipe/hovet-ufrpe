import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { resource } from "./resource_validator";

const findManyInput = z.object({});
const findManyInDbInput = findManyInput;
const findManyOutput = resource;
const findManyInDbOutput = resource;

export const findManyValidator = toTaskEither(findManyInput);

export type FindManyInput = z.infer<typeof findManyInput>;
export type FindManyOutput = z.infer<typeof findManyOutput>;
export type FindManyInDbInput = z.infer<typeof findManyInDbInput>;
export type FindManyInDbOutput = z.infer<typeof findManyInDbOutput>;
