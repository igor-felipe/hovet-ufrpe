import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { resource } from "./resource_validator";

const resourceInput = resource.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
const resourceOutput = resource;
const resourceInDbInput = resourceInput;
const resourceInDbOutput = resource;

export const resourceValidator = toTaskEither(resourceInput);

export type CreateInput = z.infer<typeof resourceInput>;
export type CreateOutput = z.infer<typeof resourceOutput>;
export type CreateInDbInput = z.infer<typeof resourceInDbInput>;
export type CreateInDbOutput = z.infer<typeof resourceInDbOutput>;
