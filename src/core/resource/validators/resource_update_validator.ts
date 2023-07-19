import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { resource } from "./resource_validator";

const updateInput = resource.pick({ id: true });
const updateOutput = resource;
const updateInDbInput = updateInput;
const updateInDbOutput = resource;

export const updateValidator = toTaskEither(updateInput);

export type UpdateInDbInput = z.infer<typeof updateInDbInput>;
export type UpdateInDbOutput = z.infer<typeof updateInDbOutput>;
export type UpdateOutput = z.infer<typeof updateOutput>;
export type UpdateInput = z.infer<typeof updateInput>;
