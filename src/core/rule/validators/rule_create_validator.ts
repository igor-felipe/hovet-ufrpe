import { z } from "zod";
import { toTaskEither } from "@/core/helpers";
import { rule } from "./rule_validator";

const createInput = rule.omit({ id: true, createdAt: true, updatedAt: true });
const createOutput = rule;
const createInDbInput = createInput;
const createInDbOutput = rule;

export const ruleValidator = toTaskEither(createInput);

export type CreateInput = z.infer<typeof createInput>;
export type CreateOutput = z.infer<typeof createOutput>;
export type CreateInDbInput = z.infer<typeof createInDbInput>;
export type CreateInDbOutput = z.infer<typeof createInDbOutput>;
