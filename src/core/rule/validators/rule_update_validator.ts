import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { rule } from "./rule_validator";

const updateInput = rule.pick({ id: true, permission: true });
const updateOutput = rule;
const updateInDbInput = updateInput;
const updateInDbOutput = rule;

export const updateValidator = toTaskEither(updateInput);

export type UpdateInDbInput = z.infer<typeof updateInDbInput>;
export type UpdateInDbOutput = z.infer<typeof updateInDbOutput>;
export type UpdateOutput = z.infer<typeof updateOutput>;
export type UpdateInput = z.infer<typeof updateInput>;
