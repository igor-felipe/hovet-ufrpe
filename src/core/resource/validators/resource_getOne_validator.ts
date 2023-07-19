import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { resource } from "./resource_validator";

const getOneInput = resource.pick({ id: true });
const getOneOutput = resource;
const getOneInDbOutput = getOneOutput;
const getOneInDbInput = getOneInput;

export const getOneValidator = toTaskEither(getOneInput);

export type GetOneOutput = z.infer<typeof getOneOutput>;
export type GetOneInput = z.infer<typeof getOneInput>;
export type GetOneInDbInput = z.infer<typeof getOneInDbInput>;
export type GetOneInDbOutput = z.infer<typeof getOneInDbOutput>;
